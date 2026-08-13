import os
import json
import numpy as np
import streamlit as st
import tensorflow as tf
from PIL import Image

from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_classic.chains import RetrievalQA
from langchain_core.prompts import PromptTemplate

st.set_page_config(page_title="AgriWorld: Disease Detection", layout="wide")

# --- Styling & Headers ---
st.title(" AgriWorld: Plant Disease & Pesticide AI")
st.markdown("""
Upload a photo of a diseased plant leaf. The system will use our custom-trained CNN to detect the disease, and then query our Pesticides RAG AI to give you prevention tips and ranked chemical/organic treatments!
""")

# --- Sidebar Configuration ---
st.sidebar.header("Configuration")
google_api_key = st.sidebar.text_input("Google API Key", type="password")

# --- Resource Loading Setup ---
@st.cache_resource
def load_ml_model():
    model_path = 'agriworld_disease_model.h5'
    if not os.path.exists(model_path):
        return None
    return tf.keras.models.load_model(model_path)

@st.cache_data
def load_class_names():
    class_path = 'class_names.json'
    if not os.path.exists(class_path):
        return None
    with open(class_path, 'r') as f:
        return json.load(f)

@st.cache_resource
def setup_rag_agent(api_key):
    os.environ["GOOGLE_API_KEY"] = api_key
    csv_path = "Dataset/pesticides_dataset.csv"
    
    if not os.path.exists(csv_path):
        return None
        
    loader = CSVLoader(file_path=csv_path)
    documents = loader.load()
    
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
    vectorstore = FAISS.from_documents(documents, embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    
    prompt_template = """
    Given the following information about pesticides and diseases:
    
    {context}
    
    The farmer's crop is suffering from the disease: '{question}'.
    
    Please provide:
    1. A brief summary of the disease.
    2. Ways to prevent it from spreading based on the tips provided in the data.
    3. A ranked list of recommended pesticides for this disease, ranked by their 'Effectiveness Rating' and 'Safety Rating'. Explain why each pesticide is ranked there.
    
    If the context does not contain enough information, explain that you don't have pesticides for this specific disease yet.
    
    Answer:
    """
    
    PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": PROMPT}
    )
    return qa_chain

# --- Main App Execution ---
model = load_ml_model()
class_names = load_class_names()

if not model or not class_names:
    st.warning(" Model or Class Names not found! Please run `python train_model.py` first to generate the necessary files.")
else:
    uploaded_file = st.file_uploader("Upload Leaf Image (JPEG/PNG)", type=["jpg", "jpeg", "png"])
    
    if uploaded_file is not None:
        # Display the image
        image = Image.open(uploaded_file).convert('RGB')
        
        col1, col2 = st.columns([1, 2])
        
        with col1:
            st.image(image, caption="Uploaded Image", use_column_width=True)
            
        with col2:
            st.subheader(" Disease Analysis:")
            with st.spinner("Classifying image..."):
                # Preprocess image
                img_resized = image.resize((224, 224))
                img_array = tf.keras.preprocessing.image.img_to_array(img_resized)
                img_array = np.expand_dims(img_array, axis=0) / 255.0
                
                # Predict
                preds = model.predict(img_array)
                confidence = np.max(preds)
                predicted_class = class_names[np.argmax(preds)]
                
                st.success(f"**Detected Disease:** {predicted_class}")
                st.info(f"**Confidence Score:** {confidence*100:.2f}%")
            
            if not google_api_key:
                st.warning("Please provide your Google API Key in the sidebar to generate pesticide recommendations!")
            else:
                if "Healthy" in predicted_class:
                    st.balloons()
                    st.success("Your plant is totally healthy! No pesticides required.")
                else:
                    st.subheader(" Pesticide Recommendations (RAG)")
                    with st.spinner("Querying vector database & LLM..."):
                        try:
                            qa_chain = setup_rag_agent(google_api_key)
                            
                            if qa_chain:
                                response = qa_chain.invoke({"query": predicted_class})
                                st.write(response["result"])
                            else:
                                st.error("Failed to initialize RAG pipeline. Ensure your pesticide CSV exists.")
                        except Exception as e:
                            st.error(f"Error communicating with Google APIs. Is your key valid? \n {e}")
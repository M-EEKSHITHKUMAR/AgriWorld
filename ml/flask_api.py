import os
import json
import numpy as np
from PIL import Image
import io

import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# LangChain (stable imports)
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS

# ✅ IMPORTANT FIX: correct import
from langchain.chains import RetrievalQA

from langchain.prompts import PromptTemplate

load_dotenv()

app = Flask(__name__)
CORS(app)

# ---------------- CONFIG ----------------
MODEL_PATH = "agriworld_disease_model.h5"
CLASS_PATH = "class_names.json"
DATASET_PATH = "Dataset/pesticides_dataset.csv"

model = None
class_names = []
qa_chain = None


# ---------------- INIT SYSTEM ----------------
def init_system():
    global model, class_names, qa_chain

    # ---- Load ML model ----
    if os.path.exists(MODEL_PATH):
        print(" Loading TensorFlow model...")
        model = tf.keras.models.load_model(MODEL_PATH)
    else:
        print(" WARNING: ML model not found!")

    # ---- Load class names ----
    if os.path.exists(CLASS_PATH):
        with open(CLASS_PATH, "r") as f:
            class_names = json.load(f)
    else:
        print(" WARNING: class_names.json not found!")

    # ---- RAG setup ----
    api_key = os.getenv("GOOGLE_API_KEY")

    if not api_key:
        print(" WARNING: GOOGLE_API_KEY missing → RAG disabled")
        return

    if not os.path.exists(DATASET_PATH):
        print(" WARNING: Dataset missing → RAG disabled")
        return

    try:
        print(" Initializing RAG pipeline...")

        loader = CSVLoader(file_path=DATASET_PATH)
        documents = loader.load()

        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001"
        )

        vectorstore = FAISS.from_documents(documents, embeddings)
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

        prompt_template = """
        You are an agricultural expert.

        Context:
        {context}

        Disease:
        {question}

        Provide:
        1. Disease summary
        2. Prevention methods
        3. Ranked pesticide recommendations
        4. End with: PESTICIDES_LIST: item1, item2

        If unknown:
        PESTICIDES_LIST: N/A
        """

        PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )

        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.2
        )

        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": PROMPT},
        )

        print(" RAG pipeline ready!")

    except Exception as e:
        print(" RAG init failed:", str(e))
        qa_chain = None


# init at startup
init_system()


# ---------------- PREDICT API ----------------
@app.route("/predict", methods=["POST"])
def predict():
    global model, class_names, qa_chain

    if model is None or not class_names:
        return jsonify({"error": "Model not loaded"}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty file"}), 400

    try:
        # ---- IMAGE PROCESSING ----
        image = Image.open(io.BytesIO(file.read())).convert("RGB")
        image = image.resize((224, 224))

        img_array = tf.keras.preprocessing.image.img_to_array(image)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        # ---- PREDICTION ----
        preds = model.predict(img_array)
        confidence = float(np.max(preds))
        predicted_class = class_names[np.argmax(preds)]

        # ---- RAG RESPONSE ----
        if "Healthy" in predicted_class:
            rag_response = "Plant is healthy. No pesticides needed. PESTICIDES_LIST: N/A"

        elif qa_chain:
            try:
                result = qa_chain.invoke({"query": predicted_class})
                rag_response = result.get("result", str(result))
            except Exception as e:
                rag_response = f"RAG error: {str(e)} PESTICIDES_LIST: N/A"
        else:
            rag_response = "RAG system offline. PESTICIDES_LIST: N/A"

        # ---- Extract pesticides ----
        pesticides = "N/A"

        if "PESTICIDES_LIST:" in rag_response:
            parts = rag_response.split("PESTICIDES_LIST:")
            rag_response = parts[0].strip()
            pesticides = parts[1].strip()

        return jsonify({
            "disease": predicted_class,
            "confidence": confidence,
            "treatment": rag_response,
            "pesticides": pesticides
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
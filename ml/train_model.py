import os
import json
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model

# Configuration
DATASET_DIR = "Dataset/Plant Village Dataset"
TRAIN_DIR = os.path.join(DATASET_DIR, "Train")
VAL_DIR = os.path.join(DATASET_DIR, "Val")

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10

def main():
    print("Initializing Disease Detection Training Pipeline...")

    # Data Augmentation for Training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )

    # Validation Scaling
    val_datagen = ImageDataGenerator(rescale=1./255)

    if not os.path.exists(TRAIN_DIR):
        print(f"Error: Training directory not found at {TRAIN_DIR}")
        return

    # Load images
    train_generator = train_datagen.flow_from_directory(
        TRAIN_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )

    val_generator = val_datagen.flow_from_directory(
        VAL_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )

    # Extract class names and save to disk
    class_names = list(train_generator.class_indices.keys())
    with open('class_names.json', 'w') as f:
        json.dump(class_names, f)
    print(f"Discovered {len(class_names)} classes.")

    # Build the MobileNetV2 Architecture
    print("Building Model Layout...")
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(len(class_names), activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    # Compile the model
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    # Train
    print("Starting Training Sequence...")
    history = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=EPOCHS,
        steps_per_epoch=len(train_generator),
        validation_steps=len(val_generator)
    )

    print("Final Training Accuracy:", round(history.history['accuracy'][-1] * 100, 2))
    print("Final Validation Accuracy:", round(history.history['val_accuracy'][-1] * 100, 2))
    print("Final Training Loss:", round(history.history['loss'][-1], 4))
    print("Final Validation Loss:", round(history.history['val_loss'][-1], 4))
    print("Epoch 1 Training Accuracy:", round(history.history['accuracy'][0] * 100, 2))
    print("Number of Classes:", len(class_names))

    # Save the model
    model_path = 'agriworld_disease_model_v1.h5'
    model.save(model_path)
    print(f"Training Complete! Model saved out to: {model_path} and Classes saved to class_names.json")

    # Future Work: Fine-tuning Base model.

if __name__ == "__main__":
    main()
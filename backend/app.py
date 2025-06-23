from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app)
model = load_model("model.h5")

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    image = Image.open(file).convert('L').resize((28, 28))
    image = img_to_array(image).reshape(1, 28, 28, 1).astype('float32') / 255.0

    prediction = model.predict(image)[0]
    digit = int(np.argmax(prediction))
    confidence = float(np.max(prediction) * 100)

    return jsonify({"digit": digit, "confidence": confidence})


# ✅ This is required to actually start the Flask server
if __name__ == '__main__':
    app.run(debug=True)

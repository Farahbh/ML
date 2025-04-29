from flask import Flask, render_template, request, jsonify
import torch
import torch.nn.functional as F
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification
from pathlib import Path  # <--- IMPORTANT À AJOUTER

# Initialiser Flask
app = Flask(__name__)

# Charger ton modèle fine-tuné
model = DistilBertForSequenceClassification.from_pretrained(Path("./emotion_model"), local_files_only=True)
tokenizer = DistilBertTokenizerFast.from_pretrained(Path("./emotion_model"), local_files_only=True)

# Détection d'émotion
def detect_emotion(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = F.softmax(outputs.logits, dim=1)
    top_idx = torch.argmax(probs, dim=1).item()
    emotion = model.config.id2label[top_idx]  # directement le mot
    confidence = probs[0, top_idx].item()
    return emotion, confidence

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict_api', methods=['POST'])
def predict_api():
    data = request.get_json()
    text = data['text']
    emotion, confidence = detect_emotion(text)
    return jsonify({'emotion': emotion, 'confidence': round(confidence * 100, 2)})

if __name__ == '__main__':
    app.run(debug=True)

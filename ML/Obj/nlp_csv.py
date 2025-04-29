# Fichier: train_emotion_model.py (SANS LabelEncoder)

import pandas as pd
import torch
from torch.utils.data import Dataset
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split

# 1. Charger ton fichier CSV traduit
df = pd.read_csv('avis_etudiants_200_translated.csv')

# 2. Vérification de la bonne colonne
if 'Commentaire_anglais' in df.columns:
    text_column = 'Commentaire_anglais'
else:
    raise Exception("❌ Erreur : colonne 'Commentaire_anglais' introuvable dans ton fichier CSV.")

# 3. Vérification des labels d'émotions
if 'Emotion' not in df.columns:
    emotions = ['admiration', 'amusement', 'anger', 'annoyance', 'approval', 'gratitude', 'joy', 'neutral', 'sadness', 'disapproval']
    df['Emotion'] = [emotions[i % len(emotions)] for i in range(len(df))]

# 4. Créer id2label et label2id
unique_emotions = sorted(df['Emotion'].unique())
id2label = {idx: emotion for idx, emotion in enumerate(unique_emotions)}
label2id = {emotion: idx for idx, emotion in id2label.items()}

# 5. Remplacer les émotions par leurs indices
df['label'] = df['Emotion'].map(label2id)

# 6. Split
train_texts, val_texts, train_labels, val_labels = train_test_split(
    df[text_column].tolist(), 
    df['label'].tolist(), 
    test_size=0.2, 
    random_state=42
)

# 7. Tokenizer
tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')

train_encodings = tokenizer(train_texts, truncation=True, padding=True, max_length=128)
val_encodings = tokenizer(val_texts, truncation=True, padding=True, max_length=128)

# 8. Dataset
class EmotionDataset(Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels
    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item
    def __len__(self):
        return len(self.labels)

train_dataset = EmotionDataset(train_encodings, train_labels)
val_dataset = EmotionDataset(val_encodings, val_labels)

# 9. Charger modèle
model = DistilBertForSequenceClassification.from_pretrained(
    'distilbert-base-uncased',
    num_labels=len(id2label),
    id2label=id2label,
    label2id=label2id
)

# 10. Paramètres d'entraînement
training_args = TrainingArguments(
    output_dir='./emotion_model',
    num_train_epochs=3,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    warmup_steps=50,
    weight_decay=0.01,
    logging_dir='./logs',
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss"
)

# 11. Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)

# 12. Entraîner 🚀
trainer.train()

# 13. Sauvegarder modèle et tokenizer
model.save_pretrained('./emotion_model')
tokenizer.save_pretrained('./emotion_model')

print("✅ Modèle entraîné et sauvegardé dans './emotion_model'")

# Script ML — Prédiction des secteurs (ODD 4/8/9) — équilibré + noms des secteurs
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix, ConfusionMatrixDisplay
from imblearn.over_sampling import SMOTE
import matplotlib.pyplot as plt
import pypyodbc
import joblib
import os

# Connexion SQL Server
connexion = pypyodbc.connect(
    "Driver={SQL Server};"
    "Server=MSI\\SQLSERVER;"
    "Database=DW_ADMISSION;"
    "Trusted_Connection=yes;"
)

# Chargement des données
df_cand = pd.read_sql("SELECT * FROM Dim_Candidats", connexion)
df_adm = pd.read_sql("SELECT * FROM Fact_Admission", connexion)
df_emp = pd.read_sql("SELECT * FROM Fact_Employability", connexion)
df_entreprises = pd.read_sql("SELECT * FROM Dim_Companies", connexion)
connexion.close()

# Nettoyage des noms de colonnes
for df in [df_cand, df_adm, df_emp, df_entreprises]:
    df.columns = df.columns.str.strip().str.lower()

# Fusion
df = df_adm.merge(df_cand, left_on='fk_candidat', right_on='pk_candidat', how='left')
df = df.merge(df_emp, left_on='pk_admission', right_on='fk_alumini', how='inner')
df = df.merge(df_entreprises, left_on='fk_company', right_on='pk_company', how='left')

if 'industry' not in df.columns:
    raise ValueError("La colonne 'industry' est absente de la table Dim_Companies.")

# Sélection des colonnes utiles
df_model = df[['score_final', 'moyen_bac', 'nature_bac', 'sexe', 'adresse', 'industry']].dropna()

# ✅ Sauvegarde des vraies valeurs texte (avant encodage)
nature_bac_values = df_model['nature_bac'].dropna().unique().tolist()
sexe_values = df_model['sexe'].dropna().unique().tolist()
adresse_values = df_model['adresse'].dropna().unique().tolist()

# Encodage LabelEncoder
for col in ['nature_bac', 'sexe', 'adresse']:
    df_model[col] = LabelEncoder().fit_transform(df_model[col].astype(str))

# Encodage spécial pour industry
le_industry = LabelEncoder()
df_model['industry'] = le_industry.fit_transform(df_model['industry'].astype(str))
label_names = le_industry.classes_

# Garder les 5 classes les plus fréquentes
top5 = pd.Series(df_model['industry']).value_counts().nlargest(5).index
df_model = df_model[df_model['industry'].isin(top5)]

X = df_model.drop(columns=['industry'])
y = df_model['industry']

# Standardisation
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Ajout de bruit pour éviter overfitting
np.random.seed(42)
noise = np.random.normal(0, 0.1, X_scaled.shape)
X_noisy = X_scaled + noise

# Équilibrage SMOTE
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_noisy, y)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X_resampled, y_resampled, test_size=0.3, random_state=42, stratify=y_resampled)

# Modèle + GridSearchCV
params = {
    'n_estimators': [100],
    'max_depth': [5, 10],
    'min_samples_split': [2, 4],
    'class_weight': ['balanced']
}
clf = GridSearchCV(RandomForestClassifier(random_state=42), params, cv=3, scoring='accuracy', n_jobs=-1)
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)

# Résultats
print("\n=== Prédiction secteurs (ODD 4/8/9) — équilibré avec noms ===")
print(f"Meilleurs paramètres : {clf.best_params_}")
print(f"Accuracy             : {accuracy_score(y_test, y_pred):.4f}\n")
print(classification_report(y_test, y_pred, target_names=le_industry.inverse_transform(top5)))

# Matrice de confusion
ConfusionMatrixDisplay.from_predictions(
    y_test, y_pred, display_labels=le_industry.inverse_transform(top5),
    cmap="YlGnBu", xticks_rotation=45
)
plt.title("Matrice de confusion — Top 5 secteurs (noms)")
plt.tight_layout()
plt.show()

# Sauvegardes
os.makedirs("model", exist_ok=True)
joblib.dump(clf.best_estimator_, "model/rf_model.pkl")
joblib.dump(scaler, "model/scaler.pkl")
joblib.dump(le_industry, "model/label_encoder_industry.pkl")
joblib.dump(X.columns.tolist(), "model/model_columns.pkl")
joblib.dump(nature_bac_values, "model/nature_bac_values.pkl")
joblib.dump(sexe_values, "model/sexe_values.pkl")
joblib.dump(adresse_values, "model/adresse_values.pkl")

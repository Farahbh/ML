import joblib
import pandas as pd
import os

# Charger les colonnes depuis model_columns.pkl
columns = joblib.load("model/model_columns.pkl")

# Créer un DataFrame vide pour faciliter le traitement
df = pd.DataFrame(columns=columns)

# Extraire les vraies valeurs
nature_bac_values = df.columns[df.columns.str.startswith("nature_bac_")].str.replace("nature_bac_", "")
sexe_values = df.columns[df.columns.str.startswith("sexe_")].str.replace("sexe_", "")
adresse_values = df.columns[df.columns.str.startswith("adresse_")].str.replace("adresse_", "")

# Sauvegarder dans le dossier model/
os.makedirs("model", exist_ok=True)
joblib.dump(nature_bac_values.tolist(), "model/nature_bac_values.pkl")
joblib.dump(sexe_values.tolist(), "model/sexe_values.pkl")
joblib.dump(adresse_values.tolist(), "model/adresse_values.pkl")

print("✅ Fichiers .pkl régénérés depuis model_columns.pkl")

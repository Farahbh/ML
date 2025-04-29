import pandas as pd
from deep_translator import GoogleTranslator

# Charger ton fichier CSV
df = pd.read_csv('avis_etudiants_200.csv')

# Traduire avec Google Translate API gratuite
df['Commentaire_anglais'] = df['Commentaire'].apply(lambda x: GoogleTranslator(source='fr', target='en').translate(x))

# Sauvegarder
df.to_csv('avis_etudiants_200_translated.csv', index=False)

print("✅ Traduction terminée !")

import joblib

nature_bac = joblib.load("model/nature_bac_values.pkl")
sexe = joblib.load("model/sexe_values.pkl")
adresse = joblib.load("model/adresse_values.pkl")

print("✅ Nature Bac :", nature_bac)
print("✅ Sexe :", sexe)
print("✅ Adresse :", adresse)

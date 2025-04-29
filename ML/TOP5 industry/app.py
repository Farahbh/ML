from flask import Flask, render_template, request
import pandas as pd
import joblib

app = Flask(__name__)

# Chargement des modèles et fichiers nécessaires
model = joblib.load("model/rf_model.pkl")
scaler = joblib.load("model/scaler.pkl")
model_columns = joblib.load("model/model_columns.pkl")
label_encoder = joblib.load("model/label_encoder_industry.pkl")

# Listes pour les menus déroulants
nature_bac_values = joblib.load("model/nature_bac_values.pkl")
sexe_values = joblib.load("model/sexe_values.pkl")
adresse_values = joblib.load("model/adresse_values.pkl")

@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None

    if request.method == "POST":
        try:
            # Récupération des valeurs du formulaire
            score_final = float(request.form["score_final"])
            moyen_bac = float(request.form["moyen_bac"])
            nature_bac = request.form["nature_bac"]
            sexe = request.form["sexe"]
            adresse = request.form["adresse"]

            # Initialisation d’un DataFrame avec les bonnes colonnes
            input_df = pd.DataFrame(columns=model_columns)
            input_df.loc[0] = 0  # toutes les colonnes à 0

            # Ajout des valeurs numériques
            input_df.at[0, "score_final"] = score_final
            input_df.at[0, "moyen_bac"] = moyen_bac

            # Encodage one-hot (mettre 1 dans la bonne colonne si elle existe)
            for col_name in [
                f"nature_bac_{nature_bac}",
                f"sexe_{sexe}",
                f"adresse_{adresse}"
            ]:
                if col_name in input_df.columns:
                    input_df.at[0, col_name] = 1
                else:
                    print(f"⚠️ Colonne absente dans le modèle : {col_name}")

            # Respecter l’ordre des colonnes du modèle
            input_df = input_df[model_columns]

            # Standardisation
            input_scaled = scaler.transform(input_df)

            # Prédiction
            prediction_code = model.predict(input_scaled)[0]
            prediction_label = label_encoder.inverse_transform([prediction_code])[0]
            prediction = f"Secteur prédit : {prediction_label}"

        except Exception as e:
            prediction = f"❌ Erreur : {str(e)}"

    return render_template(
        "index.html",
        prediction=prediction,
        nature_bac_options=nature_bac_values,
        sexe_options=sexe_values,
        adresse_options=adresse_values
    )

if __name__ == "__main__":
    app.run(debug=True)

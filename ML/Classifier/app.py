from flask import Flask, render_template, request
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# Charger modèle et scaler
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

# Charger colonnes sans la cible
with open("model_columns.txt", "r", encoding="utf-8") as f:
    columns = [line.strip() for line in f if line.strip() and line.strip() != "employed_status"]

@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None
    probability = None

    if request.method == "POST":
        try:
            performance_index = float(request.form["performance_index"])
            a_postule = int(request.form["a_postule"])
            seuil_percent = float(request.form.get("seuil_slider", 50)) / 100  # Convertir slider (0–100) → seuil 0–1

            nature_bac = request.form["nature_bac"].strip().replace(" ", "_").replace("-", "_")
            sexe = request.form["sexe"].strip().replace(" ", "_").replace("-", "_")
            adresse = request.form["adresse"].strip().replace(" ", "_").replace("-", "_")

            input_data = dict.fromkeys(columns, 0)
            input_data["performance_index"] = performance_index
            input_data["a_postule"] = a_postule
            input_data[f"nature_bac_{nature_bac}"] = 1
            input_data[f"sexe_{sexe}"] = 1
            input_data[f"adresse_{adresse}"] = 1

            df_input = pd.DataFrame([input_data])
            scaled_input = scaler.transform(df_input)

            proba = model.predict_proba(scaled_input)[0][1]
            probability = round(proba * 100, 2)

            # 🧠 Prédiction dynamique en fonction du seuil du slider
            prediction = "✅ Employé" if proba >= seuil_percent else "❌ Chômeur"

            print(f"DEBUG → proba: {proba}, seuil choisi: {seuil_percent}, résultat: {prediction}")

        except Exception as e:
            prediction = f"❌ Erreur : {str(e)}"

    return render_template("index.html", prediction=prediction, probability=probability)

if __name__ == "__main__":
    app.run(debug=True)

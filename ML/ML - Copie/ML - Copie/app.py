from flask import Flask, render_template, request
import joblib
import numpy as np

app = Flask(__name__)

# Charger le modèle et le scaler

model = joblib.load('C:/Users/Belha/OneDrive/Bureau/BII/ML/model_Kmeans.pkl')
scaler = joblib.load('C:/Users/Belha/OneDrive/Bureau/BII/ML/scaler_Kmeans.pkl')


# Cluster → Résultat majoritaire
cluster_to_result = {
    0: "LISTE ATTENTE",
    1: "ADMIS",
    2: "REFUSE",
    3: "LISTE ATTENTE"  # adapte selon ta vraie distribution
}



@app.route('/', methods=['GET', 'POST'])
def index():
    prediction = None

    if request.method == 'POST':
        # Récupérer les données du formulaire
        try:
            moyen_bac = float(request.form['moyen_bac'])
            score_final = float(request.form['score_final'])

            # Préparer les données pour le modèle
            input_data = np.array([[moyen_bac, score_final]])
            scaled_input = scaler.transform(input_data)

            # Prédiction du cluster
            cluster = model.predict(scaled_input)[0]
            resultat = cluster_to_result.get(cluster, "Inconnu")
            prediction = f"Résultat prédit : {resultat}"


        except Exception as e:
            prediction = f"Erreur : {str(e)}"

    return render_template('index.html', prediction=prediction)

if __name__ == '__main__':
    app.run(debug=True)

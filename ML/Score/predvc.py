import numpy as np
import pypyodbc as podbc
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
from flask import Flask, request, render_template_string, jsonify
from flask_cors import CORS
import os
import pandas as pd

# Initialisation de l'application Flask
app = Flask(__name__)
CORS(app)

# Chemin pour sauvegarder le modèle
MODEL_DIR = r"C:\Users\MSI\Desktop\ML obj2 obj5\models"
MODEL_PATH = os.path.join(MODEL_DIR, 'random_forest_model.joblib')

# Vérification et création du dossier si nécessaire
if not os.path.exists(MODEL_DIR):
    try:
        os.makedirs(MODEL_DIR, exist_ok=True)
        print(f"Dossier {MODEL_DIR} créé avec succès.")
    except Exception as e:
        print(f"Erreur lors de la création du dossier {MODEL_DIR}: {e}")
else:
    print(f"Dossier {MODEL_DIR} déjà existant.")

# Fonction picklable pour remplacer la lambda
def safe_log(x):
    return np.log(x) if x > 0 else 0

# 📥 Connexion SQL Server
def connect_to_db():
    try:
        conn = podbc.connect(
            "Driver={SQL Server Native Client 11.0};"
            "Server=DESKTOP-81RJ63S\\MSSQLSERVERR;"
            "Database=DW_ADMISSION;"
            "Trusted_Connection=yes;"
        )
        print("Connexion à la base de données réussie.")
        return conn
    except Exception as e:
        print(f"Erreur de connexion à la base de données : {e}")
        return None

# 📊 Lecture des données
def load_data():
    conn = connect_to_db()
    if conn is None:
        return None, None, None
    try:
        candidats = pd.read_sql_query("SELECT Pk_Candidat, Nature_Bac, Sexe FROM dbo.Dim_Candidats", conn)
        candidature = pd.read_sql_query("SELECT Candidature_PK, Resultat FROM dbo.Dim_Candidature", conn)
        admission = pd.read_sql_query("SELECT PK_Admission, FK_Candidat, FK_Candidature, Moyen_Bac, Score_Final FROM dbo.Fact_Admission", conn)
        print("Données chargées avec succès.")
        return candidats, candidature, admission
    except Exception as e:
        print(f"Erreur lors de la lecture des données : {e}")
        return None, None, None
    finally:
        conn.close()

# Entraîner et sauvegarder le modèle Random Forest
def train_random_forest():
    # Charger les données
    candidats, candidature, admission = load_data()
    if candidats is None or candidature is None or admission is None:
        return {"error": "Échec du chargement des données"}

    # Nettoyage des noms de colonnes
    candidats.columns = candidats.columns.str.strip().str.lower()
    candidature.columns = candidature.columns.str.strip().str.lower()
    admission.columns = admission.columns.str.strip().str.lower()

    # Fusion des tables
    df = admission.merge(candidats, left_on="fk_candidat", right_on="pk_candidat") \
                  .merge(candidature, left_on="fk_candidature", right_on="candidature_pk")

    # Supprimer les lignes avec des valeurs manquantes
    df = df.dropna()

    # Feature Engineering
    df['moyen_squared'] = df['moyen_bac'] ** 2
    df['interaction_resultat_moyen'] = df['moyen_bac'] * df['resultat'].map({'Admis': 1, 'Refusé': 0})
    df['log_moyen_bac'] = df['moyen_bac'].apply(safe_log)
    df['moyen_bac_log_squared'] = df['log_moyen_bac'] ** 2
    df['interaction_sexe_moyen_bac'] = df['sexe'].map({'M': 1, 'F': 0}) * df['moyen_bac']

    # Séparation Features / Target
    features = ['moyen_bac', 'moyen_squared', 'log_moyen_bac', 'moyen_bac_log_squared',
                'interaction_resultat_moyen', 'interaction_sexe_moyen_bac', 'nature_bac',
                'sexe', 'resultat']
    target = 'score_final'

    X = df[features]
    y = df[target]

    # Supprimer les colonnes constantes
    const_cols = X.columns[X.nunique() <= 1]
    if len(const_cols) > 0:
        print("Colonnes constantes supprimées :", list(const_cols))
        X = X.drop(columns=const_cols)

    # Préprocessing
    categorical_features = ['nature_bac', 'sexe', 'resultat']
    numerical_features = [col for col in X.columns if col not in categorical_features]
    preprocessor = ColumnTransformer(transformers=[
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features),
        ('num', StandardScaler(), numerical_features)
    ])

    # Pipeline avec RandomForest et GridSearchCV
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(random_state=42))
    ])

    param_grid_rf = {
        'regressor__n_estimators': [100, 200, 300],
        'regressor__max_depth': [3, 5, 10],
        'regressor__min_samples_split': [2, 5],
        'regressor__min_samples_leaf': [1, 2]
    }

    # Entraînement avec GridSearchCV
    print("⚙️ Entraînement du modèle RandomForest avec GridSearchCV...")
    grid_search = GridSearchCV(pipeline, param_grid_rf, cv=5, scoring='r2', n_jobs=None)
    grid_search.fit(X, y)

    # Sauvegarder le modèle
    try:
        joblib.dump(grid_search.best_estimator_, MODEL_PATH)
        print(f"✅ Modèle RandomForest sauvegardé à : {MODEL_PATH}")
        if os.path.exists(MODEL_PATH):
            print(f"Confirmation : Le fichier {MODEL_PATH} a été créé avec succès.")
        else:
            print(f"Erreur : Le fichier {MODEL_PATH} n'a pas été créé.")
    except Exception as e:
        print(f"Erreur lors de la sauvegarde du modèle : {e}")
        return {"error": f"Échec de la sauvegarde du modèle : {str(e)}"}

    # Résultats
    y_pred = grid_search.predict(X)
    return {
        "mse": mean_squared_error(y, y_pred),
        "r2": r2_score(y, y_pred),
        "best_params": grid_search.best_params_,
        "model_path": MODEL_PATH
    }

# HTML pour le formulaire (sans le champ sexe)
FORM_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prédiction du Score Final</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { text-align: center; }
        form { display: flex; flex-direction: column; gap: 10px; }
        label { font-weight: bold; }
        input, select { padding: 8px; font-size: 16px; }
        button { padding: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
        button:hover { background-color: #45a049; }
        #result { margin-top: 20px; font-size: 18px; }
    </style>
</head>
<body>
    <h1>Prédiction du Score Final</h1>
    <form id="predictionForm" action="/predict" method="POST">
        <label for="moyen_bac">Moyen Bac :</label>
        <input type="number" step="0.01" min="0" max="20" id="moyen_bac" name="moyen_bac" required>

        <label for="nature_bac">Nature du Bac :</label>
        <select id="nature_bac" name="nature_bac" required>
            <option value="Littéraire">Littéraire</option>
            <option value="Science">Science</option>
            <option value="Informatique">Informatique</option>
            <option value="Maths">Maths</option>
            <option value="Lettre">Lettre</option>
            <option value="Economie">Economie</option>
            <option value="Sport">Sport</option>
        </select>

        <label for="resultat">Résultat :</label>
        <select id="resultat" name="resultat" required>
            <option value="Admis">Admis</option>
            <option value="Refusé">Refusé</option>
        </select>

        <button type="submit">Prédire</button>
    </form>
    <div id="result"></div>

    <script>
        document.getElementById('predictionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            console.log("Données envoyées :", data);

            try {
                const response = await fetch('/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                const result = await response.json();
                document.getElementById('result').innerText = result.error || `Score prédit : ${result.score}`;
            } catch (error) {
                console.error("Erreur lors de la prédiction :", error);
                document.getElementById('result').innerText = 'Erreur lors de la prédiction : ' + error.message;
            }
        });
    </script>
</body>
</html>
"""

# Entraîner le modèle au démarrage (optionnel)
@app.route('/train', methods=['GET'])
def train_model():
    try:
        result = train_random_forest()
        if "error" in result:
            return jsonify({"error": result["error"]}), 500
        return jsonify(result)
    except Exception as e:
        print(f"Erreur dans /train : {str(e)}")
        return jsonify({"error": str(e)}), 500

# Afficher le formulaire
@app.route('/', methods=['GET'])
def show_form():
    return render_template_string(FORM_HTML)

# Faire une prédiction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Charger le modèle
        print(f"Tentative de chargement du modèle depuis : {MODEL_PATH}")
        if not os.path.exists(MODEL_PATH):
            print("Modèle non trouvé.")
            return jsonify({"error": "Modèle non trouvé. Veuillez entraîner le modèle d'abord."}), 404

        model = joblib.load(MODEL_PATH)
        print("Modèle chargé avec succès.")

        # Récupérer les données du formulaire
        data = request.get_json()
        print(f"Données reçues : {data}")
        if not data:
            print("Aucune donnée fournie.")
            return jsonify({"error": "Aucune donnée fournie"}), 400

        # Valider les champs requis (sans sexe)
        required_fields = ['moyen_bac', 'nature_bac', 'resultat']
        for field in required_fields:
            if field not in data:
                print(f"Champ manquant : {field}")
                return jsonify({"error": f"Champ manquant : {field}"}), 400

        # Convertir moyen_bac en float
        try:
            moyen_bac = float(data['moyen_bac'])
            if moyen_bac <= 0:
                print("Moyen Bac doit être positif.")
                return jsonify({"error": "Moyen Bac doit être positif"}), 400
        except ValueError:
            print("Moyen Bac doit être un nombre valide.")
            return jsonify({"error": "Moyen Bac doit être un nombre valide"}), 400

        # Valider nature_bac
        valid_nature_bac = ['Littéraire', 'Science', 'Informatique', 'Maths', 'Lettre', 'Economie', 'Sport']
        if data['nature_bac'] not in valid_nature_bac:
            print(f"Nature du Bac invalide : {data['nature_bac']}")
            return jsonify({"error": f"Nature du Bac invalide. Valeurs possibles : {valid_nature_bac}"}), 400

        # Valider resultat
        valid_resultat = ['Admis', 'Refusé']
        if data['resultat'] not in valid_resultat:
            print(f"Résultat invalide : {data['resultat']}")
            return jsonify({"error": f"Résultat invalide. Valeurs possibles : {valid_resultat}"}), 400

        # Créer un DataFrame avec les données d'entrée, en ajoutant un sexe par défaut
        input_data = {
            'moyen_bac': moyen_bac,
            'nature_bac': data['nature_bac'],
            'sexe': 'M',  # Valeur par défaut pour sexe
            'resultat': data['resultat']
        }
        print(f"Données d'entrée : {input_data}")

        # Feature Engineering
        input_df = pd.DataFrame([input_data])
        input_df['moyen_squared'] = input_df['moyen_bac'] ** 2
        input_df['interaction_resultat_moyen'] = input_df['moyen_bac'] * input_df['resultat'].map({'Admis': 1, 'Refusé': 0})
        input_df['log_moyen_bac'] = input_df['moyen_bac'].apply(safe_log)
        input_df['moyen_bac_log_squared'] = input_df['log_moyen_bac'] ** 2
        input_df['interaction_sexe_moyen_bac'] = input_df['sexe'].map({'M': 1, 'F': 0}) * input_df['moyen_bac']
        print(f"DataFrame après feature engineering : \n{input_df}")

        # Sélectionner les features dans le bon ordre
        features = ['moyen_bac', 'moyen_squared', 'log_moyen_bac', 'moyen_bac_log_squared',
                    'interaction_resultat_moyen', 'interaction_sexe_moyen_bac', 'nature_bac',
                    'sexe', 'resultat']
        input_df = input_df[features]

        # Faire la prédiction
        prediction = model.predict(input_df)[0]
        print(f"Prédiction : {prediction}")
        return jsonify({"score": round(float(prediction), 2)})
    except Exception as e:
        print(f"Erreur dans /predict : {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
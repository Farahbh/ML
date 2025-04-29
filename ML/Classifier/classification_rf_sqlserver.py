import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
import matplotlib.pyplot as plt
import seaborn as sns
import pypyodbc
import numpy as np
import joblib

# Connexion SQL Server
connexion = pypyodbc.connect(
    "Driver={SQL Server};"
    "Server=MSI\SQLSERVER;"  
    "Database=DW_ADMISSION;"
    "Trusted_Connection=yes;"
)

# Chargement des données
df_cand = pd.read_sql("SELECT * FROM Dim_Candidats", connexion)
df_adm = pd.read_sql("SELECT * FROM Fact_Admission", connexion)
df_emp = pd.read_sql("SELECT * FROM Fact_Employability", connexion)
df_unemp = pd.read_sql("SELECT * FROM Dim_UnemployedAlumini", connexion)
df_joboffers = pd.read_sql("SELECT * FROM Fact_JobOffers", connexion)
connexion.close()

# Nettoyage noms de colonnes
for df in [df_cand, df_adm, df_emp, df_unemp, df_joboffers]:
    df.columns = df.columns.str.strip().str.lower()

# Génération de la variable cible
df_emp['employed_status'] = 1
df_unemp['employed_status'] = 0
df_emp = df_emp.rename(columns={'fk_alumini': 'fk_candidat'})
df_unemp = df_unemp.rename(columns={'pk_unemployedalumini': 'fk_candidat'})
df_status = pd.concat([df_emp[['fk_candidat', 'employed_status']], df_unemp[['fk_candidat', 'employed_status']]])

# Feature Engineering
df = df_adm.merge(df_cand, left_on='fk_candidat', right_on='pk_candidat', how='left')
df = df.merge(df_status, on='fk_candidat', how='inner')

# Nombre de candidatures (proxy activité)
a_postule = df_joboffers[['fk_unemployedalumini']].drop_duplicates()
a_postule = a_postule.rename(columns={'fk_unemployedalumini': 'fk_candidat'})
a_postule['a_postule'] = 1
df = df.merge(a_postule, on='fk_candidat', how='left')
df['a_postule'] = df['a_postule'].fillna(0)

# Index de performance (pondération score + bac)
df['performance_index'] = df['score_final'] * 0.7 + df['moyen_bac'] * 0.3

# Sélection des variables
df_model = df[['performance_index', 'nature_bac', 'sexe', 'adresse', 'a_postule', 'employed_status']].dropna()

# 👉 Encodage avec get_dummies (One-Hot Encoding)
df_model = pd.get_dummies(df_model, columns=['nature_bac', 'sexe', 'adresse'], drop_first=True)

# Séparation des features/target
X = df_model.drop('employed_status', axis=1)
y = df_model['employed_status']

# Standardisation + SMOTE
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_scaled, y)

# 🧪 Vérification des classes
print("📊 Répartition des classes dans y_resampled :")
print(pd.Series(y_resampled).value_counts())

# Split + GridSearch
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.25, random_state=42)

params = {
    'n_estimators': [100, 200],
    'max_depth': [5, 10],
    'min_samples_split': [2, 4],
    'class_weight': ['balanced']
}
grid = GridSearchCV(RandomForestClassifier(random_state=42), params, cv=3, scoring='accuracy', n_jobs=-1)
grid.fit(X_train, y_train)
model = grid.best_estimator_
y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:, 1]

# 🔬 TEST avec valeurs faibles
X_test_sample = np.zeros((1, X.shape[1]))  # toutes les colonnes = 0
X_test_scaled = scaler.transform(X_test_sample)
pred = model.predict(X_test_scaled)[0]
proba = model.predict_proba(X_test_scaled)[0][1]

print("\n🔍 Test de prédiction forcée avec valeurs = 0 :")
print("🧠 Prédiction brute :", pred)
print("📊 Probabilité d'emploi :", round(proba * 100, 2), "%")

# 📊 Affichage des résultats
acc = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_proba)
report = classification_report(y_test, y_pred)
cm = confusion_matrix(y_test, y_pred)

print("\n Résultats du modèle Random Forest :")
print("=======================================")
print(f" Meilleurs paramètres : {grid.best_params_}")
print(f" Accuracy           : {acc:.4f}")
print(f" F1 Score           : {f1:.4f}")
print(f" ROC AUC            : {auc:.4f}")
print("\n Rapport de classification :\n")
print(report)
print("\n Matrice de confusion :")
print(cm)
# ✅ Sauvegarde du modèle AVANT affichage du graphique
joblib.dump(model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")
print("✅ Modèle et scaler sauvegardés.")
# Affichage graphique de la matrice de confusion
plt.figure(figsize=(6, 4))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.title("Matrice de confusion")
plt.xlabel("Prédit")
plt.ylabel("Réel")
plt.tight_layout()
plt.show()


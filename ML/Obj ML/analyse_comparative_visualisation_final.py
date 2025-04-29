import pypyodbc
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, mean_squared_error, r2_score, silhouette_score, confusion_matrix, roc_curve
from sklearn.cluster import KMeans
from prophet import Prophet
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings("ignore")

# Connexion SQL Server
connexion = pypyodbc.connect(
    "Driver={SQL Server Native Client 11.0};"
    "Server=MSI\\SQLSERVER;"
    "Database=DW_ADMISSION;"
    "Trusted_Connection=yes;"
)

# Chargement des données
df_adm = pd.read_sql("SELECT * FROM Fact_Admission", connexion)
df_cand = pd.read_sql("SELECT * FROM Dim_Candidats", connexion)
df_emp = pd.read_sql("SELECT * FROM Fact_Employability", connexion)
connexion.close()

# Nettoyage
df_adm.columns = df_adm.columns.str.strip().str.lower()
df_cand.columns = df_cand.columns.str.strip().str.lower()
df_emp.columns = df_emp.columns.str.strip().str.lower()

# Fusion des données
df = df_adm.merge(df_cand, left_on='fk_candidat', right_on='pk_candidat')
df = df.merge(df_emp, left_on='fk_candidat', right_on='fk_alumini', how='left')
df['employed_status'] = df['connection_number'].apply(lambda x: 1 if pd.notnull(x) and x > 0 else 0)

# Préparation pour ML
df_model = df[['score_final', 'moyen_bac', 'nature_bac', 'sexe', 'adresse', 'employed_status']].dropna()
for col in ['nature_bac', 'sexe', 'adresse']:
    df_model[col] = LabelEncoder().fit_transform(df_model[col].astype(str))
df_model['performance_index'] = df_model['score_final'] * 0.7 + df_model['moyen_bac'] * 0.3

# ⚖️ Équilibrage des classes
df_class0 = df_model[df_model['employed_status'] == 0]
df_class1 = df_model[df_model['employed_status'] == 1].sample(n=len(df_class0)*5, random_state=42)
df_model_balanced = pd.concat([df_class0, df_class1])
print("✅ Nouveau dataset équilibré :")
print(df_model_balanced['employed_status'].value_counts())

# Séparation X / y
X = df_model_balanced.drop('employed_status', axis=1)
y = df_model_balanced['employed_status']

# Normalisation
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split équilibré
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

print("✅ Répartition de y_test :")
print(pd.Series(y_test).value_counts())

# Classification
clf = RandomForestClassifier(random_state=42)
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)
y_proba = clf.predict_proba(X_test)[:, 1]
acc = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_proba)

# Régression
reg = RandomForestRegressor(random_state=42)
reg.fit(X_train, df_model_balanced.loc[y_train.index, 'score_final'])
y_pred_reg = reg.predict(X_test)
rmse = np.sqrt(mean_squared_error(df_model_balanced.loc[y_test.index, 'score_final'], y_pred_reg))
r2 = r2_score(df_model_balanced.loc[y_test.index, 'score_final'], y_pred_reg)

# Clustering
km = KMeans(n_clusters=2, random_state=42)
clusters = km.fit_predict(X_scaled)
silhouette = silhouette_score(X_scaled, clusters)

# Série temporelle
try:
    df_emp['date'] = pd.to_datetime(df_emp['fk_date'].astype(str), format='%Y%m%d', errors='coerce')
except:
    df_emp['date'] = pd.to_datetime(df_emp['fk_date'], errors='coerce')
df_ts = df_emp.groupby(df_emp['date'].dt.to_period('M')).size().reset_index(name='nb_employes')
df_ts['ds'] = df_ts['date'].astype(str)
df_ts['y'] = df_ts['nb_employes']
df_ts = df_ts[['ds', 'y']].dropna()

# Visualisation
plt.figure(figsize=(15, 4))

# Confusion Matrix
plt.subplot(1, 4, 1)
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.title("Matrice de confusion")
plt.xlabel("Prédit")
plt.ylabel("Réel")

# ROC Curve
plt.subplot(1, 4, 2)
fpr, tpr, _ = roc_curve(y_test, y_proba)
plt.plot(fpr, tpr, label=f"AUC = {auc:.2f}")
plt.plot([0, 1], [0, 1], "--", color='gray')
plt.xlabel("FPR")
plt.ylabel("TPR")
plt.title("Courbe ROC")
plt.legend()

# Feature Importance
plt.subplot(1, 4, 3)
importances = clf.feature_importances_
sns.barplot(x=importances, y=X.columns)
plt.title("Importance des variables")

# Prophet
plt.subplot(1, 4, 4)
if len(df_ts) >= 2:
    model = Prophet()
    model.fit(df_ts)
    future = model.make_future_dataframe(periods=3, freq='M')
    forecast = model.predict(future)
    plt.plot(pd.to_datetime(df_ts['ds']), df_ts['y'], label="Réel")
    plt.plot(pd.to_datetime(forecast['ds']), forecast['yhat'], label="Prévision")
    plt.title("Série temporelle (Prophet)")
    plt.xticks(rotation=45)
    plt.legend()
else:
    plt.text(0.1, 0.5, "Pas assez de données\npour Prophet", fontsize=12)
    plt.axis('off')

plt.tight_layout()
plt.savefig("visualisation_modele_resultats.png")

# Résumé final
print("\n📊 Comparaison des modèles :")
print(f"Classification → Accuracy: {acc:.2f}, F1: {f1:.2f}, AUC: {auc:.2f}")
print(f"Régression     → RMSE: {rmse:.4f}, R²: {r2:.4f}")
print(f"Clustering     → Silhouette Score: {silhouette:.4f}")
if len(df_ts) >= 2:
    print("Série temporelle → Prophet exécuté avec succès ✅")
else:
    print("Série temporelle → Pas assez de données ❌")

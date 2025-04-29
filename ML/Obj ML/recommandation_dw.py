
import pypyodbc
import pandas as pd

# Connexion à SQL Server
connexion = pypyodbc.connect(
    "Driver={SQL Server Native Client 11.0};"
    "Server=MSI\\SQLSERVER;"
    "Database=DW_ADMISSION;"
    "Trusted_Connection=yes;"
)

# Requête 1 : table Dim_UnemployedAlumini
df_alumini = pd.read_sql("SELECT * FROM Dim_UnemployedAlumini", connexion)

# Requête 2 : table Dim_Jobs
df_jobs = pd.read_sql("SELECT * FROM Dim_Jobs", connexion)

# Aperçu des résultats
print("🧑‍🎓 Dim_UnemployedAlumini :")
print(df_alumini.head())

print("\n💼 Dim_Jobs :")
print(df_jobs.head())

# Fermer la connexion
connexion.close()

import pandas as pd
import pypyodbc
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def generer_recommandations():
    # Connexion SQL Server
    connexion = pypyodbc.connect(
        "Driver={SQL Server};"
        "Server=MSI\\SQLSERVER;"
        "Database=DW_ADMISSION;"
        "Trusted_Connection=yes;"
    )

    query_candidats = "SELECT PK_UnemployedAlumini, FullName, Skills FROM dbo.Dim_UnemployedAlumini WHERE Skills IS NOT NULL"
    query_jobs = "SELECT PK_Jobs, Title, Description FROM dbo.Dim_Jobs"

    candidats = pd.read_sql(query_candidats, connexion)
    jobs = pd.read_sql(query_jobs, connexion)
    connexion.close()

    jobs.columns = [col.lower() for col in jobs.columns]
    candidats.columns = [col.lower() for col in candidats.columns]
    jobs['job_text'] = jobs['title'].fillna('') + ' ' + jobs['description'].fillna('')

    french_stopwords = [
        "le", "la", "les", "un", "une", "de", "des", "du", "et", "en", "à", "au", "aux",
        "pour", "par", "avec", "sans", "dans", "sur", "ce", "cet", "cette", "ces", "il",
        "elle", "nous", "vous", "ils", "elles", "que", "qui", "quoi", "où", "dont", "lui",
        "leur", "y", "ne", "pas", "plus", "moins", "fait", "faire", "être", "avoir"
    ]

    vectorizer = TfidfVectorizer(stop_words=french_stopwords)
    job_vectors = vectorizer.fit_transform(jobs['job_text'])

    results = []
    for _, candidat in candidats.iterrows():
        skill_vector = vectorizer.transform([candidat['skills']])
        similarities = cosine_similarity(skill_vector, job_vectors).flatten()
        best_idx = similarities.argmax()
        results.append({
            'Candidat': candidat['fullname'],
            'Skills': candidat['skills'],
            'Reco_JobID': jobs.iloc[best_idx]['pk_jobs'],
            'Reco_JobTitle': jobs.iloc[best_idx]['title'],
            'SimilarityScore': round(similarities[best_idx], 3)
        })

    return pd.DataFrame(results)


# ✅ Bloc de test en exécution directe
if __name__ == "__main__":
    df_recommendations = generer_recommandations()
    print(df_recommendations)
    df_recommendations.to_csv("meilleure_recommandation_par_candidat.csv", index=False)
    print("✅ CSV généré avec succès.")

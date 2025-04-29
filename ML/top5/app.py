from flask import Flask, render_template, request
from systeme_recommandation_ia_dedup import generer_recommandations

app = Flask(__name__)

@app.route('/')
def index():
    limit = request.args.get('limit', default=20, type=int)
    df = generer_recommandations()

    if limit != -1:  # -1 signifie "Tous"
        df = df.head(limit)

    return render_template('index.html', tables=df.to_dict(orient='records'), current_limit=limit)

if __name__ == '__main__':
    app.run(debug=True)

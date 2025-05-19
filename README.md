 Academic Pathway Analysis and Employability Prediction Platform

## Overview
Change is an intelligent platform for analyzing academic pathways and predicting employability. It helps educational institutions support students in their professional trajectories through data-driven insights.

## Objectives
- Analyze admission, training, and employment data.
- Predict student employability post-training.
- Segment alumni using clustering (e.g., KMeans).
- Identify atypical or at-risk academic paths.
- Forecast admission/employment trends with time-series analysis.
- Analyze student/alumni feedback sentiment.

## Technologies
- **Language**: Python
- **Machine Learning**: Scikit-learn, XGBoost, KMeans, SMOTE
- **NLP**: spaCy, Transformers (Hugging Face), TF-IDF
- **Visualization**: Power BI
- **Database**: SQL Server
- **Deployment**: Flask (API + HTML/CSS), Angular

## Setup Instructions
### Prerequisites
- Python 3.8
- Node.js and Angular CLI
- SQL Server
- Power BI Desktop
- Python libraries: `flask`, `flask-cors`, `pandas`, `scikit-learn`, `xgboost`, `spacy`, `transformers`

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/change.git
   ```
2. **Backend**:
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Configure SQL Server in `config.py`.

## Running the Platform
1. **Start the Flask Backend**:
   - In the `backend/` directory:
     ```bash
     python app.py
     ```
   - Access the Flask server at [http://localhost:5000](http://localhost:5000).

2. **Start the Angular Frontend**:
 
   - Access the Angular app at [http://localhost:4200](http://localhost:4200).

## Usage
- Import data into SQL Server.
- Train models using scripts in `models/`.
- Visualize insights in Power BI.
- Access predictions via the Flask API (e.g., `/predict_employability`).

## Contributing
Submit pull requests or open issues for suggestions and bug reports.

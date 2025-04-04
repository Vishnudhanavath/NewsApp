from flask import Flask, request, jsonify
import pandas as pd
import pickle
import re
import string
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from flask import Flask, request, jsonify
from flask_cors import CORS 
# Initialize Flask app
app = Flask(__name__)

# Step 1: Read the datasets
data_fake = pd.read_csv('Fake.csv')
data_true = pd.read_csv('True.csv')

# Step 2: Label the data
data_fake["class"] = 0  # Fake News -> Class 0
data_true["class"] = 1  # Real News -> Class 1

# Step 3: Merge datasets and shuffle
data_merge = pd.concat([data_fake, data_true], axis=0)
data = data_merge.drop(['title', 'subject', 'date'], axis=1)
data = data.sample(frac=1).reset_index(drop=True)

# Step 4: Text Preprocessing
def clean_text(text):
    text = text.lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub("\\W", " ", text)
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text

data['text'] = data['text'].apply(clean_text)

# Step 5: Prepare features and labels
X = data['text']
y = data['class']

# Step 6: Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Step 7: Convert text data into numerical format using TF-IDF
vectorizer = TfidfVectorizer()
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# Step 8: Train the Logistic Regression model
model = LogisticRegression()
model.fit(X_train_tfidf, y_train)

# Step 9: Save the model and vectorizer
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(vectorizer, open("vectorizer.pkl", "wb"))

print("Model trained and saved successfully!")
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})  # Allow only React frontend

# Load the saved model and vectorizer
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))
model = pickle.load(open("model.pkl", "rb"))

def clean_text(text):
    text = text.lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub("\\W", " ", text)
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    news_text = data.get("news", "")

    if not news_text:
        return jsonify({"error": "No news text provided"}), 400

    processed_text = clean_text(news_text)
    transformed_text = vectorizer.transform([processed_text])
    
    # Get probability of being Real News
    prob_real = model.predict_proba(transformed_text)[0][1]  # Probability of "Real"

    # If probability of being real is at least 40%, classify as "Real News"
    prediction = "Real News" if prob_real > 0.4 else "Fake News"

    return jsonify({"prediction": prediction})

if __name__ == '__main__':
    app.run(debug=True)
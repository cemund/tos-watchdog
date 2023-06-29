import joblib
import os

path = (os.path.dirname(__file__))

# Load the model from the file
clf = joblib.load(path+'\\unfair_clause_clf.pkl')

#predict
def predict(sentences):
  results = clf.predict(sentences)
  return results
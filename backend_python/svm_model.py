import joblib
import os

path=(os.path.dirname(__file__))

# Load the model from the file
clf = joblib.load(path+'\\clf_model.pkl')

#predict
def predict(sentences):
  results = clf.predict(sentences)
  return results
  #Correct syntax: sentence/s should be inside [] (array)
#print(clf.predict(["Some services require that you have a Google Account in order to work — for example, to use Gmail, you need a Google Account so that you have a place to send and receive your email."]))
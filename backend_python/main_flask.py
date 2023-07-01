import nltk
# nltk.download('punkt')

import svm_model as svm
import string
from flask import Flask, request

app = Flask(__name__)

@app.route('/identifyUnfair', methods=['POST'])
def identifyUnfairClauses():
    if request.method == "POST":

        sentence = request.json['stringData'] # access the 

        # Preprocessing
        sentence_lower = sentence.lower() # lowercasing

        sentence_lower = sentence_lower.replace("/u2019","'") # replacing u2019 or ’ to '

        sentence_with_space = sentence_lower.replace("'", " '") # add space before ' as stated in the dataset

        translation_table = str.maketrans("", "", string.punctuation) # make a translation table

        cleaned_sentence = sentence_with_space.translate(translation_table) # remove punctuations

        # add the sentence into a list
        temp_list = []
        temp_list.append(cleaned_sentence)

        # Prediction
        pred = svm.predict(temp_list)[0] # stores 0 or 1 to pred

        # creating a response
        response_data = {'message': 'String received successfully', 'pred': int(pred)}

        # return
        return response_data

if __name__ == "__main__":
    app.run(debug=True, threaded="True")
import nltk
nltk.download('punkt')

import svm_model as svm
import string
#import web_scraper as scraper
from flask import Flask, request, jsonify, json
from nltk.tokenize import sent_tokenize

app = Flask(__name__)

@app.route('/identifyUnfair', methods=['POST'])
def identifyUnfairClauses():
    if request.method == "POST":

        sentence = request.json['stringData']

        # Preprocessing
        sentence_lower = sentence.lower()

        sentence_lower = sentence_lower.replace("/u2019","'")

        sentence_with_space = sentence_lower.replace("'", " '")

        translation_table = str.maketrans("", "", string.punctuation)

        cleaned_sentence = sentence_with_space.translate(translation_table)

        temp_list =[]
        temp_list.append(cleaned_sentence)

        
        pred = svm.predict(temp_list)[0]
        print(pred)
        print(cleaned_sentence)
        # Process the string data as needed
        response_data = {'message': 'String received successfully', 'pred': int(pred)}
        return response_data
        # data = request.json['s']
        # # Process the string data as needed
        # response_data = {'message': 'String received successfully'}
        # return response_data
        # 1. Get the Website from the javascript ajax
        #website = request.form.get('website')
        # sentences = request.form.get('sentence')
        # #sentences = json.loads(request)
        # sentences = json.loads(sentences)
        #print(len(sentences))
        
        # sentence = request.json['sentence']

        # # 2. Scrape the website
        # #scrapedText = scraper.scrape(website)

        # # 3. Tokenize the text by sentences and remove \n in all sentences
        # #sentTokenized = sent_tokenize(scrapedText)
        # #removedNewLineSentences = []
        # #for sentence in sentTokenized:
        # #    removedNewLineSentences.append(sentence.replace("\n", " "))
        
        # #print(removedNewLineSentences)

        # #print(sentences)
        # #sentences = ["important to establish what you can expect", "As a result, these Terms of Service help define"]

        # # PPREPROCESSING

        # # lowercasing

        # print(sentence)
        # # lowercase_sentences = [sentence.lower() for sentence in sentences]

        # # # add space before single quote like the dataset
        # # def add_space_before_single_quote(sentence):
        # #     sentence_with_space = sentence.replace("'", " '")
        # #     return sentence_with_space
        
        # # sentences_with_space = [add_space_before_single_quote(sentence) for sentence in lowercase_sentences]

        # # # sentence tokenization
        # # # example result: [['Hello!', 'How are you?'], ["I'm doing well.", 'What about you?'], ["That's great to hear!']]
        # # tokenized_sentences = [sent_tokenize(sentence) for sentence in  sentences_with_space]

        # # # punctuation removal
        # # def remove_punctuation(sentence):
        # #     translation_table = str.maketrans("", "", string.punctuation)
        # #     return sentence.translate(translation_table)
        
        # # cleaned_sentences = [[remove_punctuation(sentence) for sentence in sublist] for sublist in tokenized_sentences]

        # # # 4. Predict
        # # classifiedSentences = svm.predict(lowercase_sentences)
        # # toList = []
        # # for i in range(len(classifiedSentences)):
        # #     toList.append(int(classifiedSentences[i]))
        
        # # # alternative prediction (predicting each sentences)
        # # classifiedSentences = []
        # # for sublist in cleaned_sentences:
        # #     classifiedSentences.append(svm.predict(sublist))

        # # # Pring classified Sentences Using list comprehension
        # # print('\n'.join(' '.join(str(number) for number in array) for array in classifiedSentences))

        # # #print("Classified Len"+str(len(classifiedSentences)))
        # # #print(classifiedSentences)
        # # def find_indices(list_to_check, item_to_find):
        # #     indices = []
        # #     for idx, value in enumerate(list_to_check):
        # #         if value == item_to_find:
        # #             indices.append(idx)
        # #     return indices
        
        # # indexOfUnfairClause = find_indices(toList, 1)

        # # for i in range(len(indexOfUnfairClause)):
        # #     print(indexOfUnfairClause[i])
        # #     print(sentences[indexOfUnfairClause[i]])

        # return jsonify({'classification': 0})

if __name__ == "__main__":
    app.run(debug=True, threaded="True")
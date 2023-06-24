from flask import Flask, render_template, request, jsonify, json
#from nltk.tokenize import sent_tokenize

import svm_model as svm
#import web_scraper as scraper

app = Flask(__name__)

@app.route('/identifyUnfair', methods=['POST'])
def identifyUnfairClauses():
    if request.method == "POST":
        # 1. Get the Website from the javascript ajax
        #website = request.form.get('website')
        sentences = request.form.get('info')
        #sentences = json.loads(request)
        sentences = json.loads(sentences)
        #print(len(sentences))
        

        # 2. Scrape the website
        #scrapedText = scraper.scrape(website)

        # 3. Tokenize the text by sentences and remove \n in all sentences
        #sentTokenized = sent_tokenize(scrapedText)
        #removedNewLineSentences = []
        #for sentence in sentTokenized:
        #    removedNewLineSentences.append(sentence.replace("\n", " "))
        
        #print(removedNewLineSentences)

        #print(sentences)
        #sentences = ["important to establish what you can expect", "As a result, these Terms of Service help define"]
        # 4. Predict
        classifiedSentences = svm.predict(sentences)
        toList = []
        for i in range(len(classifiedSentences)):
            toList.append(int(classifiedSentences[i]))
            
        #print("Classified Len"+str(len(classifiedSentences)))
        #print(classifiedSentences)
        def find_indices(list_to_check, item_to_find):
            indices = []
            for idx, value in enumerate(list_to_check):
                if value == item_to_find:
                    indices.append(idx)
            return indices
        
        indexOfUnfairClause = find_indices(toList, 1)

        for i in range(len(indexOfUnfairClause)):
            print(indexOfUnfairClause[i])
            print(sentences[indexOfUnfairClause[i]])

        return jsonify({'sentences': indexOfUnfairClause})

if __name__ == "__main__":
    app.run(debug=True, threaded="True")
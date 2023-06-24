from flask import Flask, render_template, request, jsonify
from nltk.tokenize import sent_tokenize

import svm_model as svm
import web_scraper as scraper

app = Flask(__name__)

@app.route('/identifyUnfair', methods=['POST'])
def identifyUnfairClauses():
    if request.method == "POST":
        # 1. Get the Website from the javascript ajax
        website = request.form.get('website')

        # 2. Scrape the website
        scrapedText = scraper.scrape(website)

        # 3. Tokenize the text by sentences and remove \n in all sentences
        #sentTokenized = sent_tokenize(scrapedText)
        #removedNewLineSentences = []
        #for sentence in sentTokenized:
        #    removedNewLineSentences.append(sentence.replace("\n", " "))
        
        #print(removedNewLineSentences)

        #print(sentences)
        #sentences = ["important to establish what you can expect", "As a result, these Terms of Service help define"]
        return jsonify({'sentences': scrapedText})

if __name__ == "__main__":
    app.run(debug=True, threaded="True")
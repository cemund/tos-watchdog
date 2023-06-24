
document
  .getElementById("highlightButton")
  .addEventListener("click", function () {


    (async () => {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      const contentJSResponse = await chrome.tabs.sendMessage(tab.id, {clicked: true});
      console.log(contentJSResponse);


      $.ajax({
        url:"http://127.0.0.1:5000/identifyUnfair",
        type: "POST",
        data: { info: JSON.stringify(contentJSResponse.extractedSentences) },
        success: function(response) {
          var sentencesToHighlight = response.sentences;
          console.log(sentencesToHighlight);

         

          
          (async () => {
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            const newJSResponse = await chrome.tabs.sendMessage(tab.id, {array: contentJSResponse.extractedSentences, indexOfUnfairClause: sentencesToHighlight});
            console.log(newJSResponse);



          })();
          
          //console.log(responses.messmess.includes(sentencesToHighlight[5]));
          //console.log(responses.messmess.includes(sentencesToHighlight[5]));
          //console.log(responses.messmess.includes(sentencesToHighlight[5]));
          //console.log(responses.messmess.indexOf(sentencesToHighlight[5]));
        }
      });
    })();
  });


  
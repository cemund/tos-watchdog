document
  .getElementById("highlightButton")
  .addEventListener("click", function () {
    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const contentJSResponse = await chrome.tabs.sendMessage(tab.id, {
        clicked: true,
      });
      // console.log(contentJSResponse);

      // $.ajax({
      //   url: "http://127.0.0.1:5000/identifyUnfair",
      //   type: "POST",
      //   data: { info: JSON.stringify(contentJSResponse.extractedSentences) },
      //   success: function (response) {
      //     var sentencesToHighlight = response.sentences;
      //     console.log(sentencesToHighlight);

      //     (async () => {
      //       const [tab] = await chrome.tabs.query({
      //         active: true,
      //         currentWindow: true,
      //       });
      //       const newJSResponse = await chrome.tabs.sendMessage(tab.id, {
      //         array: contentJSResponse.extractedSentences,
      //         indexOfUnfairClause: sentencesToHighlight,
      //       });
      //       console.log(newJSResponse);
      //     })();
      //   },
      // });
    })();
  });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.sentence) {
    // console.log(request.sentence);
    // $.ajax({
    //   url: "http://127.0.0.1:5000/identifyUnfair",
    //   type: "POST",
    //   data: { sentence: JSON.stringify(request.sentence) },
    //   success: function (response) {
    //     // var sentencesToHighlight = response.sentences;
    //     // console.log(sentencesToHighlight);
    //   },
    // });

    // const processedData = await performAsyncOperation(stringData);

    fetch("http://127.0.0.1:5000/identifyUnfair", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stringData: request.sentence }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Handle the response from Flask
        // console.log(responseData);

        sendResponse(responseData);
      })
      .catch((error) => {
        // Handle any errors
        // console.error("Error:", error);
      });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
  // const stringData = request.stringData;

  // fetch("http://your-flask-server-endpoint", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ stringData: stringData }),
  // })
  //   .then((response) => response.json())
  //   .then((responseData) => {
  //     // Handle the response from Flask
  //     console.log(responseData);
  //   })
  //   .catch((error) => {
  //     // Handle any errors
  //     console.error("Error:", error);
  //   });
});

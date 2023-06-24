
document
  .getElementById("highlightButton")
  .addEventListener("click", function () {
    // add prediction model here that returns the unfair sentences in a list

    // 1.  Get the URL of the current page (assuming it is a ToS)
    chrome.tabs.query({ active: true, currentWindow: true}, ([currentTab]) => {
      

    // 2. Send the URL to the Python Backend for Web Scraping, Tokenization, and Classification

      $.ajax({
        url:"http://127.0.0.1:5000/identifyUnfair",
        type: "POST",
        data: { website: currentTab.url},
        success: function(response){
          var sentencesToHighlight = response.sentences;
          
          console.log(sentencesToHighlight)
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { sentences: sentencesToHighlight },
              function (response) {
                console.log("Highlighting complete!");
      
                // add number to navigate
                const para = document.createElement("p");
                para.setAttribute("id", "numberNavigate");
                para.innerHTML =
                  "<span id='current-pos'>1</span> / <span id='total-pos'>" +
                  sentencesToHighlight.length +
                  "</span>";
                document.body.appendChild(para);
      
                // add button to navigate
                const btn_nav = document.createElement("button");
                btn_nav.setAttribute("id", "highlightNavigate");
                btn_nav.innerText = "Navigate";
                document.body.appendChild(btn_nav);
      
                document
                  .getElementById("highlightNavigate")
                  .addEventListener("click", function () {
                    var indexToNavigate = parseInt(
                      document.getElementById("current-pos").innerText
                    );
      
                    var totalPos = parseInt(
                      document.getElementById("total-pos").innerText
                    );
      
                    if (indexToNavigate == totalPos) {
                      indexToNavigate = 1;
                    } else {
                      indexToNavigate += 1;
                    }
      
                    var idToNavigate = "highlight-" + indexToNavigate;
                    console.log(idToNavigate);
                    chrome.tabs.query(
                      { active: true, currentWindow: true },
                      function (tabs) {
                        console.log(idToNavigate);
                        chrome.tabs.sendMessage(
                          tabs[0].id,
                          { id: idToNavigate },
                          function (response) {}
                        );
                      }
                    );
      
                    document.getElementById("current-pos").innerText =
                      indexToNavigate;
                  });
                document.getElementById("highlightButton").remove();
              }
            );
          });
        }
      });
    });
    
    //var sentencesToHighlight = [
     // "important to establish what you can expect",
      //"As a result, these Terms of Service help define",
     // "To the extent that applicable local law prevents certain disputes from being resolved in a California court",
    //];
    //alert("Scanning for unfair clauses.");
  });


  
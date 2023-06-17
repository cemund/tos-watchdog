document
  .getElementById("highlightButton")
  .addEventListener("click", function () {
    // add prediction model here that returns the unfair sentences in a list
    var sentencesToHighlight = [
      "important to establish what you can expect",
      "As a result, these Terms of Service help define",
      "To the extent that applicable local law prevents certain disputes from being resolved in a California court",
    ];
    alert("Scanning for unfair clauses.");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { sentences: sentencesToHighlight },
        function (response) {
          
          console.log("Highlighting complete!");
          
          var detector = document.getElementById("scan");
          detector.setAttribute("hidden", "true");
          var navi = document.getElementById("navi");
          navi.removeAttribute("hidden");

          document.getElementById("close").addEventListener("click", function(){
            var navi = document.getElementById("navi");
            navi.setAttribute("hidden", "true");
            var detector = document.getElementById("scan");
            detector.removeAttribute("hidden");
          });

          // add number to navigate
          // const para = document.createElement("p");
          // para.setAttribute("id", "numberNavigate");
          // para.innerHTML =
          //   "<span id='current-pos'>1</span> / <span id='total-pos'>" +
          //   sentencesToHighlight.length +
          //   "</span>";
          // document.body.appendChild(para);

          // add button to navigate
          // const btn_nav = document.createElement("button");
          // btn_nav.setAttribute("id", "highlightNavigate");
          // btn_nav.innerText = "Navigate";
          // document.body.appendChild(btn_nav);

          // document
          //   .getElementById("highlightNavigate")
          //   .addEventListener("click", function () {
          //     var indexToNavigate = parseInt(
          //       document.getElementById("current-pos").innerText
          //     );

          //     var totalPos = parseInt(
          //       document.getElementById("total-pos").innerText
          //     );

          //     if (indexToNavigate == totalPos) {
          //       indexToNavigate = 1;
          //     } else {
          //       indexToNavigate += 1;
          //     }

          //     var idToNavigate = "highlight-" + indexToNavigate;
          //     console.log(idToNavigate);
          //     chrome.tabs.query(
          //       { active: true, currentWindow: true },
          //       function (tabs) {
          //         console.log(idToNavigate);
          //         chrome.tabs.sendMessage(
          //           tabs[0].id,
          //           { id: idToNavigate },
          //           function (response) {}
          //         );
          //       }
          //     );

          //     document.getElementById("current-pos").innerText =
          //       indexToNavigate;
          //   });

        }
      );
    });
  });

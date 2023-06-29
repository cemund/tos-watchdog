document
  .getElementById("highlightButton")
  .addEventListener("click", function () {
    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const response = await chrome.tabs.sendMessage(tab.id, {
        clicked: true,
      });
    })();
  });
  // INFORMATION POP UP
$(document).ready(function(){
  $('#descPop').popover({
    placement: "left",
    content: "A Chrome extension that helps users identify unfair or problematic clauses in website terms of service agreements. Click 'Detect' to start."
  });
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.sentence) {
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

  // if all predictions is done
  if (request.count) {
    // handle request when done
    console.log(request.count);
    // add number to navigate
    const para = document.createElement("p");
    para.setAttribute("id", "numberNavigate");
    para.innerHTML =
      "<span id='current-pos'>1</span> / <span id='total-pos'>" +
      request.count +
      "</span>";
    document.body.appendChild(para);

    // add button to navigate
    const btn_nav = document.createElement("button");
    btn_nav.setAttribute("id", "highlightNavigate");
    btn_nav.innerText = "Navigate";
    document.body.appendChild(btn_nav);
    
//     var detector = document.getElementById("scan");
//           detector.setAttribute("hidden", "true");
//           var navi = document.getElementById("navi");
//           navi.removeAttribute("hidden");

//           document.getElementById("close").addEventListener("click", function(){
//             var navi = document.getElementById("navi");
//             navi.setAttribute("hidden", "true");
//             var detector = document.getElementById("scan");
//             detector.removeAttribute("hidden");
//           });

    document
      .getElementById("highlightNavigate")
      .addEventListener("click", function () {
        var indexToNavigate = parseInt(
          document.getElementById("current-pos").innerText
        );

        var totalPos = parseInt(document.getElementById("total-pos").innerText);

        if (indexToNavigate == totalPos) {
          indexToNavigate = 1;
        } else {
          indexToNavigate += 1;
        }

        // var idToNavigate = "highlight-" + indexToNavigate;
        // console.log(idToNavigate);
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            console.log(indexToNavigate);
            chrome.tabs.sendMessage(
              tabs[0].id,
              { index_to_nav: indexToNavigate },
              function (response) {}
            );
          }
        );

        document.getElementById("current-pos").innerText = indexToNavigate;
      });
    document.getElementById("highlightButton").remove();
  }
});


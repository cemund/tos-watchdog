// initialization for tooltip
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

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
// $(document).ready(function () {
//   $("#descPop").popover({
//     placement: "left",
//     content:
//       "A Chrome extension that helps users identify unfair or problematic clauses in website terms of service agreements. Click 'Detect' to start.",
//   });
// });

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
    document.getElementById("total-pos").innerText = request.count;

    // var detector = document.getElementById("scan");
    // detector.setAttribute("hidden", "true");
    // var navi = document.getElementById("navi");
    // navi.removeAttribute("hidden");

    // document.getElementById("close").addEventListener("click", function () {
    //   var navi = document.getElementById("navi");
    //   navi.setAttribute("hidden", "true");
    //   var detector = document.getElementById("scan");
    //   detector.removeAttribute("hidden");
    // });

    // add eventlistener for right button
    document.getElementById("right").addEventListener("click", function () {
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
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(indexToNavigate);
        chrome.tabs.sendMessage(
          tabs[0].id,
          { index_to_nav: indexToNavigate },
          function (response) {}
        );
      });

      document.getElementById("current-pos").innerText = indexToNavigate;
    });

    // add eventlistener for left button
    document.getElementById("left").addEventListener("click", function () {
      console.log("hello");
      var indexToNavigate = parseInt(
        document.getElementById("current-pos").innerText
      );

      var totalPos = parseInt(document.getElementById("total-pos").innerText);

      if (indexToNavigate == 1) {
        indexToNavigate = totalPos;
      } else {
        indexToNavigate -= 1;
      }

      // var idToNavigate = "highlight-" + indexToNavigate;
      // console.log(idToNavigate);
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(indexToNavigate);
        chrome.tabs.sendMessage(
          tabs[0].id,
          { index_to_nav: indexToNavigate },
          function (response) {}
        );
      });

      document.getElementById("current-pos").innerText = indexToNavigate;
    });
    // display none if to navigate
    document.getElementById("detecting-UI").classList.add("visually-hidden");
    document
      .getElementById("navigation-UI")
      .classList.remove("visually-hidden");
  }
});

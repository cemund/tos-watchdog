// initialization for tooltip
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

// add event listener to the "detect button"
document
  .getElementById("highlightButton")
  .addEventListener("click", function () {
    // hide content of button and replace with loading animation
    document
      .getElementById("before-detect-content")
      .classList.add("visually-hidden");
    document
      .getElementById("after-detect-content")
      .classList.remove("visually-hidden");

    // send message to content script to detect unfair clauses
    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const response = await chrome.tabs.sendMessage(tab.id, {
        detect: true,
      });
    })();
  });

// add event listener to the "x button in navigation"
document.getElementById("exit").addEventListener("click", function () {
  document.getElementById("current-pos").innerText = "1";
  document.getElementById("total-pos").innerText = "1";

  // revert to first detecting UI display
  document
    .getElementById("before-detect-content")
    .classList.remove("visually-hidden");
  document
    .getElementById("after-detect-content")
    .classList.add("visually-hidden");
  document.getElementById("detecting-UI").classList.remove("visually-hidden");
  document.getElementById("navigation-UI").classList.add("visually-hidden");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { isClear: true },
      function (response) {}
    );
  });
});

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

  sendMessageToNavigate(indexToNavigate);
});

// add eventlistener for left button
document.getElementById("left").addEventListener("click", function () {
  let indexToNavigate = parseInt(
    document.getElementById("current-pos").innerText
  );

  let totalPos = parseInt(document.getElementById("total-pos").innerText);

  if (indexToNavigate == 1) {
    indexToNavigate = totalPos;
  } else {
    indexToNavigate -= 1;
  }

  sendMessageToNavigate(indexToNavigate);
});

function sendMessageToNavigate(indexToNavigate) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { index_to_nav: indexToNavigate },
      function (response) {}
    );
  });

  document.getElementById("current-pos").innerText = indexToNavigate;
}

// add listener for content script
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

        sendResponse(responseData);
      })
      .catch((error) => {
        // Handle any errors
      });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }

  // if all predictions is done
  if (request.count) {
    document.getElementById("total-pos").innerText = request.count;

    // display navigation UI
    document.getElementById("detecting-UI").classList.add("visually-hidden");
    document
      .getElementById("navigation-UI")
      .classList.remove("visually-hidden");
  }
});

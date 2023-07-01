var initial_body_innerHTML = document.body.innerHTML;
var unfair_count = 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // if "x" button in navigation UI is pressed
  if (request.isClear) {
    document.body.innerHTML = initial_body_innerHTML;
  }

  // if navigate button is pressed
  if (request.index_to_nav) {
    console.log(request.index_to_nav);
    const targetElement =
      document.querySelectorAll(".unfair")[request.index_to_nav];

    var topOffset = targetElement.getBoundingClientRect().top; // Calculate the top offset of the element relative to the viewport
    window.scrollTo({
      top: window.scrollY + topOffset - 200, // Adjust the scroll position by subtracting 200 pixels from the current scroll position plus the top offset
      behavior: "smooth", // Scroll smoothly to the adjusted position
    });
  }

  if (request.detect) {
    document.body.innerHTML = initial_body_innerHTML;

    unfair_count = 0;

    var arrays = [];
    var sentencesPromises = [];
    var all = document.getElementsByTagName("*");
    for (var i = 0, max = all.length; i < max; i++) {
      let inner_text_of_tag = all[i].innerText;

      if (
        !(
          all[i].innerText == null ||
          all[i].innerText === "" ||
          all[i].innerText.includes("\n") ||
          all[i].innerText.split(" ").length < 5
        )
      ) {
        //Check if element is in the list
        if (arrays.includes(all[i].innerText)) {
          continue;
        }

        let sentenceRegex = /(?<!https?:\/\/[^\s]+)\s*[.!?]+/;

        let sentences = inner_text_of_tag
          .split(sentenceRegex)
          .map((sentence) => sentence.trim())
          .filter((sentence) => sentence !== "");

        sentencesPromises.push(predictSentences(sentences, all[i]));
      }
      arrays.push(inner_text_of_tag);
    }
    // Wait for all the promises to resolve using Promise.all
    Promise.all(sentencesPromises)
      .then(() => {
        console.log("All sentences processed");
        console.log(unfair_count);
        console.log(document.querySelectorAll(".unfair").length);

        unfair_count = document.querySelectorAll(".unfair").length;

        sendResponse({ success: true, count: unfair_count });
        // send message if done in background script
        try {
          const response = sendMessageToBackgroundScript({
            count: unfair_count,
          });
          console.log("Request succeeded:", response);
        } catch (error) {}
      })
      .catch((error) => {});
    sendResponse({ success: true });
  }
});

async function predictSentences(sentences, tag) {
  let x = 0;

  for (let i = 0; i < sentences.length; i++) {
    if (sentences[i].split(" ").length < 5) {
      continue;
    }

    const element = sentences[i];
    try {
      const response = await sendMessageToBackgroundScript({
        sentence: element,
      });
      if (response.pred == 1) {
        if (x == 0) {
          const modifiedContent = sentences
            .map((sentence) => {
              return "<span>" + sentence + "</span>";
            })
            .join(". ");

          tag.innerHTML = modifiedContent;
          x = x + 1;
        }
        const allSpan = tag.getElementsByTagName("span");

        allSpan[i].outerHTML =
          "<span class='unfair' style='background-color: red; color: white; font-size: 120%; font-weight: bold;text-transform:uppercase;padding:0px 5px;border-radius:10px;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;'>" +
          allSpan[i].innerText +
          "</span>";

        unfair_count = unfair_count + 1;
        console.log(unfair_count + ": " + element);
      }
    } catch (error) {}
  }
}

function sendMessageToBackgroundScript(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, function (response) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

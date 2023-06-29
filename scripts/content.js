var initial_body_innerHTML = document.body.innerHTML;
var unfair_count = 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // alert(request.sentences);

  if (request.sentences) {
    // alert(request.sentences);
    var sentences = request.sentences;

    var countSearch = 1;

    sentences.forEach(function (sentence) {
      search(sentence, countSearch);
      countSearch += 1;
      // alert(countSearch);
    });
  }

  // if navigate button is pressed
  if (request.index_to_nav) {
    console.log(request.index_to_nav);
    const targetElement =
      document.querySelectorAll(".unfair")[request.index_to_nav];

    // var id = request.id; // Store the array of element IDs in a variable
    // var targetElement = document.getElementById(id); // Get the first element from the array
    var topOffset = targetElement.getBoundingClientRect().top; // Calculate the top offset of the element relative to the viewport
    window.scrollTo({
      top: window.scrollY + topOffset - 200, // Adjust the scroll position by subtracting 200 pixels from the current scroll position plus the top offset
      behavior: "smooth", // Scroll smoothly to the adjusted position
    });
  }

  if (request.clicked) {
    document.body.innerHTML = initial_body_innerHTML;

    unfair_count = 0;

    var arrays = [];
    var sentencesPromises = [];
    var all = document.getElementsByTagName("*");
    for (var i = 0, max = all.length; i < max; i++) {
      //all[i].style.backgroundColor  = 'black';
      //all[i].style.color  = 'red';

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
        // console.log(all[i].innerText);

        let sentenceRegex = /(?<!https?:\/\/[^\s]+)\s*[.!?]+/;

        let sentences = inner_text_of_tag
          .split(sentenceRegex)
          .map((sentence) => sentence.trim())
          .filter((sentence) => sentence !== "");

        sentencesPromises.push(predictSentences(sentences, all[i]));

        // predictSentences(sentences, all[i])
        //   .then(() => {
        //     console.log("All sentences processed");
        //   })
        //   .catch((error) => {
        //     console.error("Error:", error);
        //   });

        // console.log("hello");
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
        } catch (error) {
          // console.error("Request failed:", error);
        }
      })
      .catch((error) => {
        // console.error("Error:", error);
      });
    // console.log(unfair_count);
    // sendResponse({ success: true, count: unfair_count });
    sendResponse({ success: true });
  }
});

// highlights search list
// function search(text, count) {
//   var bodyText = document.body.innerHTML;
//   var searchTerm = text;
//   var highlightedText = bodyText.replace(
//     searchTerm,
//     "<span id='highlight-" +
//       count +
//       "'style='background-color: red; color: white; font-size: 50px; font-weight: bold;text-transform:uppercase;padding:0px 10px;border-radius:10px;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;'>" +
//       searchTerm +
//       "</span>"
//   );
//   document.body.innerHTML = highlightedText;
// }

async function predictSentences(sentences, tag) {
  // console.log(tag.innerHTML);

  // const sentences_tmp = tag.innerHTML.split(". ");
  // add span tag to each sentence of sentences

  // tag.

  let x = 0;
  // let y = [];

  for (let i = 0; i < sentences.length; i++) {
    if (sentences[i].split(" ").length < 5) {
      continue;
    }

    const element = sentences[i];
    try {
      const response = await sendMessageToBackgroundScript({
        sentence: element,
      });
      // console.log("Request succeeded:", response);
      // Handle the response here
      if (response.pred == 1) {
        if (x == 0) {
          // get all outerHTML of <a> tags in the sentences
          // y = tag.getElementsByTagName("a");

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
        // allSpan[i].className = "unfair";
        // allSpan[i].style.color = "white";
        // allSpan[i].style.fontSize = "120%";

        // loop that return the <a> tags
        // for (let k = 0; k < y.length; k++) {
        //   if (allSpan[i].innerText.includes(y[i].innerText)) {
        //     allSpan[i].innerHTML = allSpan[i].innerHTML.replace(
        //       y[i].innerText,
        //       y[i].outerHTML
        //     );
        //   }
        // }

        unfair_count = unfair_count + 1;
        console.log(unfair_count + ": " + element);
        // tag.innerHTML = tag.innerText.replace(
        //   element,
        //   "<span class='unfair' style='background-color: red; color: white; font-size: 120%; font-weight: bold;text-transform:uppercase;padding:0px 5px;border-radius:10px;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;'>" +
        //     element +
        //     "</span>"
        // );
      }
    } catch (error) {
      // console.error("Request failed:", error);
    }
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

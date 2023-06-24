chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  document.body.innerHTML = document.body.innerHTML.replace(/\u2019/g, "'");
  // alert(request.sentences);

  if (request.sentences) {
    // alert(request.sentences);
    var sentences = request.sentences;

    // var countSearch = 1;

    // let paragraphs = document.getElementsByTagName("a");

    // for (var i = 0; i < paragraphs.length; i++) {
    //   paragraphs[i].innerHTML = paragraphs[i].innerText;
    // }
    // console.log(paragraphs);

    // sentences.forEach(function (sentence) {
    //   // search(sentence, countSearch);
    //   // if (!highlightByTag(sentence, "h3", countSearch)) {
    //   //   continue;
    //   // } else if (!highlightByTag(sentence, "p", countSearch)) {
    //   //   return;
    //   // }
    //   highlightByTag(sentence, "h3", countSearch);
    //   highlightByTag(sentence, "p", countSearch);

    //   countSearch += 1;
    // });

    for (let i = 0; i < sentences.length; i++) {
      if (highlightByTag(sentences[i], "h3", i + 1) === 0) {
        // countSearch += 1;
        continue;
      }
      if (highlightByTag(sentences[i], "p", i + 1) === 0) {
        // countSearch += 1;
        continue;
      }
    }
  }

  // if navigate button is pressed
  if (request.id) {
    var id = request.id; // Store the array of element IDs in a variable
    var targetElement = document.getElementById(id); // Get the first element from the array
    var topOffset = targetElement.getBoundingClientRect().top; // Calculate the top offset of the element relative to the viewport
    window.scrollTo({
      top: window.scrollY + topOffset - 200, // Adjust the scroll position by subtracting 200 pixels from the current scroll position plus the top offset
      behavior: "smooth", // Scroll smoothly to the adjusted position
    });
  }

  sendResponse({ success: true });
});

function highlightByTag(text, tag, count) {
  text = text.replace(/â€™/g, "'");
  let tags = document.body.getElementsByTagName(tag);
  for (let i = 0; i < tags.length; i++) {
    console.log(tags[i].innerText);
    console.log("check: " + text);
    if (tags[i].innerText.includes(text)) {
      tags[i].innerHTML = tags[i].innerText.replace(
        text,
        "<span id='highlight-" +
          count +
          "'style='background-color: red; color: white; font-size: 40px; font-weight: bold;text-transform:uppercase;padding:0px 10px;border-radius:10px;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;'>" +
          text +
          "</span>"
      );
      return 0;
    }

    // if (text == tags[i].innerText) {
    //   console.log("helooooooo");
    //   tags[i].innerHTML =
    //     "<span id='highlight-" +
    //     count +
    //     "'style='background-color: red; color: white; font-size: 50px; font-weight: bold;text-transform:uppercase;padding:0px 10px;border-radius:10px;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;'>" +
    //     text +
    //     "</span>";
    // }
  }
}

// highlights search list
function search(text, count) {
  text = text.replace(/â€™/g, "'");
  let bodyText = document.body.innerHTML;

  let searchTerm = text;
  let highlightedText = bodyText.replace(
    searchTerm,
    "<span id='highlight-" +
      count +
      "'style='background-color: red; color: white; font-size: 50px; font-weight: bold;text-transform:uppercase;padding:0px 10px;border-radius:10px;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;'>" +
      searchTerm +
      "</span>"
  );
  document.body.innerHTML = highlightedText;
}

// const article = document.querySelector("article");
// const article = document.getElementById("blog-in-article");

// // `document.querySelector` may return null if the selector doesn't match anything.
// if (article) {
//   const text = article.textContent;
//   const wordMatchRegExp = /[^\s]+/g; // Regular expression
//   const words = text.matchAll(wordMatchRegExp);
//   // matchAll returns an iterator, convert to array to get word count
//   const wordCount = [...words].length;
//   const readingTime = Math.round(wordCount / 200);
//   const badge = document.createElement("p");
//   // Use the same styling as the publish information in an article's header
//   badge.classList.add("color-secondary-text", "type--caption");
//   badge.textContent = `⏱️ ${readingTime} min read`;

//   // Support for API reference docs
//   const heading = article.querySelector("h2");
//   // Support for article docs with date
//   const date = article.querySelector("time")?.parentNode;

//   (date ?? heading).insertAdjacentElement("afterend", badge);
// }

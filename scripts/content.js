chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // alert(request.sentences);

  if (request.sentences) {
    // alert(request.sentences);
    var sentences = request.sentences;

    var countSearch = 1;

    sentences.forEach(function (sentence) {
      // alert(sentence);
      search(sentence, countSearch);
      countSearch += 1;
      // alert(countSearch);
    });
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

// highlights search list
function search(text, count) {
  var bodyText = document.body.innerHTML;
  var searchTerm = text;
  var highlightedText = bodyText.replace(
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
const article = document.getElementById("blog-in-article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const text = article.textContent;
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `⏱️ ${readingTime} min read`;

  // Support for API reference docs
  const heading = article.querySelector("h2");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  (date ?? heading).insertAdjacentElement("afterend", badge);
}

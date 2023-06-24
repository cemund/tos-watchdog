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
  if (request.id) {
    var id = request.id; // Store the array of element IDs in a variable
    var targetElement = document.getElementById(id); // Get the first element from the array
    var topOffset = targetElement.getBoundingClientRect().top; // Calculate the top offset of the element relative to the viewport
    window.scrollTo({
      top: window.scrollY + topOffset - 200, // Adjust the scroll position by subtracting 200 pixels from the current scroll position plus the top offset
      behavior: "smooth", // Scroll smoothly to the adjusted position
    });
  }

  var arrays = []
  if (request.clicked) {
    var all = document.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
        //all[i].style.backgroundColor  = 'black';
        //all[i].style.color  = 'red';
        arrays.push(all[i].innerText);
    }

    // remove unnecessary elements
    for (var i = arrays.length - 1; i >= 0; i--) {
      if (arrays[i] == null || arrays[i] === ""  || arrays[i].includes('\n') || arrays[i].split(' ').length < 5) { // arrays[i].includes('\n') ||
      arrays.splice(i, 1);
      }
      //else {
      //  arrays[i] = arrays[i].replace(/\n/g, ' ')
      //}
    }
    // remove redundant elements
    function removeDuplicates(arr) { return arr.filter((item, index) => arr.indexOf(item) === index); }
    removeDuplicates(arrays);

    /*
    var counter = 0
    for (var i=0, max=all.length; i < max; i++) {
      //all[i].style.backgroundColor  = 'black';
      //all[i].style.color  = 'red';
      //arrays.push(all[i].innerText);
      if (all[i].innerText.localeCompare(arrays[counter])){
        counter = counter + 1;
        all[i].style.backgroundColor  = 'black';
        all[i].style.color  = 'red';
      }
    }
    */

    /*
    var counter = 0;
    var testArrays = arrays;
    for (var i=0, max=all.length; i < max; i++) {
      //all[i].style.backgroundColor  = 'black';
      //all[i].style.color  = 'red';
      //arrays.push(all[i].innerText);
    //  if (all[i].innerText.localeCompare(testArrays[counter])){
      //  counter = counter + 1;
      //  all[i].style.backgroundColor  = 'black';
      //  all[i].style.color  = 'red';
    //  }
    }
    */
  }
  
  
  if (request.indexOfUnfairClause) {
    var all = document.getElementsByTagName("*");
    var indexOfUnfairClause = request.indexOfUnfairClause;
    var counter = 0;
    var array = request.array;
    for (var i=0, max=all.length; i < max; i++) {
        //all[i].style.backgroundColor  = 'black';
        //all[i].style.color  = 'red';
        //arrays.push(all[i].innerText);
        if (all[i].innerText === (array[indexOfUnfairClause[counter]])) {
          counter = counter + 1;
          all[i].style.color  = 'red'
          //all[i].style.backgroundColor  = 'black'
        }
    }
  }
  
  sendResponse({ success: true, extractedSentences: arrays});
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

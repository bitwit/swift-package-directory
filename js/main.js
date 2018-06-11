(function($) {
  'use strict';

  $('#search-form').submit((e) => {
    e.preventDefault();
    let searchTerm = $("#search-input").val();
    
    const url = "https://openwhisk.ng.bluemix.net/api/v1/web/kyle%40bitwit.ca_dev/swift-package-directory/searchPackages.json?query="
    $.ajax(url + searchTerm, {
      success: (data) => {

        $("#results").html('<ul id="results-list" class="list-group-flush"></ul>');
        const list = $("#results-list");

        if (data.docs.length == 0) {
            list.append(`<li class="list-group-item"><strong>No Results Found</strong></li>`)
        } else {
          data.docs.forEach((doc) => {
            list.append(`<li class="list-group-item">${doc.name}</li>`)
          });
        }
      }
    });
  });

})(jQuery);
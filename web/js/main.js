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

        if (data.packages.length == 0) {
            list.append(`<li class="list-group-item"><strong>No Results Found</strong></li>`)
        } else {
          console.log(data.packages);
          data.packages.forEach((doc) => {
            list.append(`<li class="list-group-item"><a target="_blank" href="${doc.html_url}"><strong>${doc.full_name}</strong> - ${doc.description}</a></li>`)
          });
        }
      }
    });
  });

})(jQuery);

(function($) {
  'use strict';

  $('#add-form').submit((e) => {
    e.preventDefault();
    let searchTerm = $("#add-input").val();
    
    const url = "https://openwhisk.ng.bluemix.net/api/v1/web/kyle%40bitwit.ca_dev/swift-package-directory/addPackage.json?repository="
    $.ajax(url + searchTerm, {
      success: (data) => {
        console.log(data);
      }
    });
  });

})(jQuery);
(function($) {
  'use strict';
  const searchInput = $("#search-input");
  const performSearch = () => {
    const url = "https://openwhisk.ng.bluemix.net/api/v1/web/kyle%40bitwit.ca_dev/swift-package-directory/searchPackages.json?query="
    const searchTerm = searchInput.val();
    if (searchTerm.length < 1) {
      $("#results").html('');
    }
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
  }

  searchInput.on('input', function (e) {
    e.preventDefault();
    performSearch();
  });

  $('#search-form').submit((e) => {
    e.preventDefault();
    performSearch();
  });

})(jQuery);

(function($) {
  'use strict';


  $('#add-form').submit((e) => {
    e.preventDefault();
    let packageName = $("#add-input").val();
    const url = "https://openwhisk.ng.bluemix.net/api/v1/web/kyle%40bitwit.ca_dev/swift-package-directory/addSwiftPackage.json?repository="
    $.ajax(url + packageName, {
      success: (data) => {
        console.log(data);

        $("#results").html('<h3 class="text-center mt-5">Added!</h3><ul id="results-list" class="list-group-flush"></ul>');
        const list = $("#results-list");

            list.append(`<li class="list-group-item"><a target="_blank" href="${data.package.html_url}">
            <strong>${data.package.full_name}</strong>
             - ${data.package.description}</a></li>`)
      },
      error: () => {
        console.log("Not found");
      }
    });
  });

})(jQuery);
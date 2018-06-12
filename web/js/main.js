(function($) {
  'use strict';
  const searchInput = $("#search-input");
  const performSearch = () => {
    const url = "https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/40586e5b69123c610ddfdaef22f087df48bc2d55a7e5031a20f808b57d498761/api/v0/search?query="
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
    const url = "https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/40586e5b69123c610ddfdaef22f087df48bc2d55a7e5031a20f808b57d498761/api/v0/add"
    $.ajax(url, {
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ repository: packageName }),
      dataType: "json",
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
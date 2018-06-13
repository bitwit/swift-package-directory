const apiBaseUrl = window.location.protocol + "//" + window.location.host;
const searchInput = $("#search-input");
const performSearch = () => {
  const url = apiBaseUrl + "/search?query=";
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

$('#add-form').submit((e) => {
  e.preventDefault();
  let packageName = $("#add-input").val();
  const url = apiBaseUrl + "/add";
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
    error: (jqXHR, textStatus, errorThrown) => {
       const reason = jqXHR.responseJSON.reason
       $("#results").html('<h3 class="text-center mt-5">Error!</h3><ul id="results-list" class="list-group-flush"></ul>');
       if (reason) {
        const list = $("#results-list");

        list.append(`<li class="list-group-item">${reason}</li>`)
       }
    }
  });
});
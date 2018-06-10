(function($) {
  'use strict';

  $('#search-form').submit((e) => {
    e.preventDefault();
    let searchTerm = $("#search-input").val();
    console.log("search for:", searchTerm);
  });

})(jQuery);
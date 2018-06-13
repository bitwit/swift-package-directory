(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var apiBaseUrl = window.location.host;
var searchInput = $("#search-input");
var performSearch = function performSearch() {
  var url = apiBaseUrl + "/search?query=";
  var searchTerm = searchInput.val();

  if (searchTerm.length < 1) {
    $("#results").html('');
  }
  $.ajax(url + searchTerm, {
    success: function success(data) {

      $("#results").html('<ul id="results-list" class="list-group-flush"></ul>');
      var list = $("#results-list");

      if (data.packages.length == 0) {
        list.append("<li class=\"list-group-item\"><strong>No Results Found</strong></li>");
      } else {
        console.log(data.packages);
        data.packages.forEach(function (doc) {
          list.append("<li class=\"list-group-item\"><a target=\"_blank\" href=\"" + doc.html_url + "\"><strong>" + doc.full_name + "</strong> - " + doc.description + "</a></li>");
        });
      }
    }
  });
};

$('#search-form').submit(function (e) {
  e.preventDefault();
  performSearch();
});

$('#add-form').submit(function (e) {
  e.preventDefault();
  var packageName = $("#add-input").val();
  var url = apiBaseUrl + "/add";
  $.ajax(url, {
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({ repository: packageName }),
    dataType: "json",
    success: function success(data) {
      console.log(data);

      $("#results").html('<h3 class="text-center mt-5">Added!</h3><ul id="results-list" class="list-group-flush"></ul>');
      var list = $("#results-list");

      list.append("<li class=\"list-group-item\"><a target=\"_blank\" href=\"" + data.package.html_url + "\">\n            <strong>" + data.package.full_name + "</strong>\n             - " + data.package.description + "</a></li>");
    },
    error: function error(jqXHR, textStatus, errorThrown) {
      var reason = jqXHR.responseJSON.reason;
      $("#results").html('<h3 class="text-center mt-5">Error!</h3><ul id="results-list" class="list-group-flush"></ul>');
      if (reason) {
        var list = $("#results-list");

        list.append("<li class=\"list-group-item\">" + reason + "</li>");
      }
    }
  });
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJQdWJsaWNfc3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sYUFBYSxPQUFPLFFBQVAsQ0FBZ0IsSUFBbkM7QUFDQSxJQUFNLGNBQWMsRUFBRSxlQUFGLENBQXBCO0FBQ0EsSUFBTSxnQkFBZ0IsU0FBaEIsYUFBZ0IsR0FBTTtBQUMxQixNQUFNLE1BQU0sYUFBYSxnQkFBekI7QUFDQSxNQUFNLGFBQWEsWUFBWSxHQUFaLEVBQW5COztBQUVBLE1BQUksV0FBVyxNQUFYLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLE1BQUUsVUFBRixFQUFjLElBQWQsQ0FBbUIsRUFBbkI7QUFDRDtBQUNELElBQUUsSUFBRixDQUFPLE1BQU0sVUFBYixFQUF5QjtBQUN2QixhQUFTLGlCQUFDLElBQUQsRUFBVTs7QUFFakIsUUFBRSxVQUFGLEVBQWMsSUFBZCxDQUFtQixzREFBbkI7QUFDQSxVQUFNLE9BQU8sRUFBRSxlQUFGLENBQWI7O0FBRUEsVUFBSSxLQUFLLFFBQUwsQ0FBYyxNQUFkLElBQXdCLENBQTVCLEVBQStCO0FBQzdCLGFBQUssTUFBTDtBQUNELE9BRkQsTUFFTztBQUNMLGdCQUFRLEdBQVIsQ0FBWSxLQUFLLFFBQWpCO0FBQ0EsYUFBSyxRQUFMLENBQWMsT0FBZCxDQUFzQixVQUFDLEdBQUQsRUFBUztBQUM3QixlQUFLLE1BQUwsZ0VBQW9FLElBQUksUUFBeEUsbUJBQTZGLElBQUksU0FBakcsb0JBQXlILElBQUksV0FBN0g7QUFDRCxTQUZEO0FBR0Q7QUFDRjtBQWRzQixHQUF6QjtBQWdCRCxDQXZCRDs7QUF5QkEsRUFBRSxjQUFGLEVBQWtCLE1BQWxCLENBQXlCLFVBQUMsQ0FBRCxFQUFPO0FBQzlCLElBQUUsY0FBRjtBQUNBO0FBQ0QsQ0FIRDs7QUFLQSxFQUFFLFdBQUYsRUFBZSxNQUFmLENBQXNCLFVBQUMsQ0FBRCxFQUFPO0FBQzNCLElBQUUsY0FBRjtBQUNBLE1BQUksY0FBYyxFQUFFLFlBQUYsRUFBZ0IsR0FBaEIsRUFBbEI7QUFDQSxNQUFNLE1BQU0sYUFBYSxNQUF6QjtBQUNBLElBQUUsSUFBRixDQUFPLEdBQVAsRUFBWTtBQUNWLFlBQVEsS0FERTtBQUVWLGlCQUFhLGtCQUZIO0FBR1YsVUFBTSxLQUFLLFNBQUwsQ0FBZSxFQUFFLFlBQVksV0FBZCxFQUFmLENBSEk7QUFJVixjQUFVLE1BSkE7QUFLVixhQUFTLGlCQUFDLElBQUQsRUFBVTtBQUNqQixjQUFRLEdBQVIsQ0FBWSxJQUFaOztBQUVBLFFBQUUsVUFBRixFQUFjLElBQWQsQ0FBbUIsOEZBQW5CO0FBQ0EsVUFBTSxPQUFPLEVBQUUsZUFBRixDQUFiOztBQUVBLFdBQUssTUFBTCxnRUFBb0UsS0FBSyxPQUFMLENBQWEsUUFBakYsaUNBQ2dCLEtBQUssT0FBTCxDQUFhLFNBRDdCLGtDQUVXLEtBQUssT0FBTCxDQUFhLFdBRnhCO0FBR0QsS0FkUztBQWVWLFdBQU8sZUFBQyxLQUFELEVBQVEsVUFBUixFQUFvQixXQUFwQixFQUFvQztBQUN4QyxVQUFNLFNBQVMsTUFBTSxZQUFOLENBQW1CLE1BQWxDO0FBQ0EsUUFBRSxVQUFGLEVBQWMsSUFBZCxDQUFtQiw4RkFBbkI7QUFDQSxVQUFJLE1BQUosRUFBWTtBQUNYLFlBQU0sT0FBTyxFQUFFLGVBQUYsQ0FBYjs7QUFFQSxhQUFLLE1BQUwsb0NBQTJDLE1BQTNDO0FBQ0E7QUFDSDtBQXZCUyxHQUFaO0FBeUJELENBN0JEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgYXBpQmFzZVVybCA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0O1xuY29uc3Qgc2VhcmNoSW5wdXQgPSAkKFwiI3NlYXJjaC1pbnB1dFwiKTtcbmNvbnN0IHBlcmZvcm1TZWFyY2ggPSAoKSA9PiB7XG4gIGNvbnN0IHVybCA9IGFwaUJhc2VVcmwgKyBcIi9zZWFyY2g/cXVlcnk9XCI7XG4gIGNvbnN0IHNlYXJjaFRlcm0gPSBzZWFyY2hJbnB1dC52YWwoKTtcblxuICBpZiAoc2VhcmNoVGVybS5sZW5ndGggPCAxKSB7XG4gICAgJChcIiNyZXN1bHRzXCIpLmh0bWwoJycpO1xuICB9XG4gICQuYWpheCh1cmwgKyBzZWFyY2hUZXJtLCB7XG4gICAgc3VjY2VzczogKGRhdGEpID0+IHtcblxuICAgICAgJChcIiNyZXN1bHRzXCIpLmh0bWwoJzx1bCBpZD1cInJlc3VsdHMtbGlzdFwiIGNsYXNzPVwibGlzdC1ncm91cC1mbHVzaFwiPjwvdWw+Jyk7XG4gICAgICBjb25zdCBsaXN0ID0gJChcIiNyZXN1bHRzLWxpc3RcIik7XG5cbiAgICAgIGlmIChkYXRhLnBhY2thZ2VzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGxpc3QuYXBwZW5kKGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj48c3Ryb25nPk5vIFJlc3VsdHMgRm91bmQ8L3N0cm9uZz48L2xpPmApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhLnBhY2thZ2VzKTtcbiAgICAgICAgZGF0YS5wYWNrYWdlcy5mb3JFYWNoKChkb2MpID0+IHtcbiAgICAgICAgICBsaXN0LmFwcGVuZChgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7ZG9jLmh0bWxfdXJsfVwiPjxzdHJvbmc+JHtkb2MuZnVsbF9uYW1lfTwvc3Ryb25nPiAtICR7ZG9jLmRlc2NyaXB0aW9ufTwvYT48L2xpPmApXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbiQoJyNzZWFyY2gtZm9ybScpLnN1Ym1pdCgoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIHBlcmZvcm1TZWFyY2goKTtcbn0pO1xuXG4kKCcjYWRkLWZvcm0nKS5zdWJtaXQoKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBsZXQgcGFja2FnZU5hbWUgPSAkKFwiI2FkZC1pbnB1dFwiKS52YWwoKTtcbiAgY29uc3QgdXJsID0gYXBpQmFzZVVybCArIFwiL2FkZFwiO1xuICAkLmFqYXgodXJsLCB7XG4gICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7IHJlcG9zaXRvcnk6IHBhY2thZ2VOYW1lIH0pLFxuICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICBzdWNjZXNzOiAoZGF0YSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coZGF0YSk7XG5cbiAgICAgICQoXCIjcmVzdWx0c1wiKS5odG1sKCc8aDMgY2xhc3M9XCJ0ZXh0LWNlbnRlciBtdC01XCI+QWRkZWQhPC9oMz48dWwgaWQ9XCJyZXN1bHRzLWxpc3RcIiBjbGFzcz1cImxpc3QtZ3JvdXAtZmx1c2hcIj48L3VsPicpO1xuICAgICAgY29uc3QgbGlzdCA9ICQoXCIjcmVzdWx0cy1saXN0XCIpO1xuXG4gICAgICBsaXN0LmFwcGVuZChgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7ZGF0YS5wYWNrYWdlLmh0bWxfdXJsfVwiPlxuICAgICAgICAgICAgPHN0cm9uZz4ke2RhdGEucGFja2FnZS5mdWxsX25hbWV9PC9zdHJvbmc+XG4gICAgICAgICAgICAgLSAke2RhdGEucGFja2FnZS5kZXNjcmlwdGlvbn08L2E+PC9saT5gKVxuICAgIH0sXG4gICAgZXJyb3I6IChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHtcbiAgICAgICBjb25zdCByZWFzb24gPSBqcVhIUi5yZXNwb25zZUpTT04ucmVhc29uXG4gICAgICAgJChcIiNyZXN1bHRzXCIpLmh0bWwoJzxoMyBjbGFzcz1cInRleHQtY2VudGVyIG10LTVcIj5FcnJvciE8L2gzPjx1bCBpZD1cInJlc3VsdHMtbGlzdFwiIGNsYXNzPVwibGlzdC1ncm91cC1mbHVzaFwiPjwvdWw+Jyk7XG4gICAgICAgaWYgKHJlYXNvbikge1xuICAgICAgICBjb25zdCBsaXN0ID0gJChcIiNyZXN1bHRzLWxpc3RcIik7XG5cbiAgICAgICAgbGlzdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPiR7cmVhc29ufTwvbGk+YClcbiAgICAgICB9XG4gICAgfVxuICB9KTtcbn0pOyJdfQ==

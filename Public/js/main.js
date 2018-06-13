(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var apiBaseUrl = window.location.host + "/";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJQdWJsaWNfc3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sYUFBYSxPQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBdUIsR0FBMUM7QUFDQSxJQUFNLGNBQWMsRUFBRSxlQUFGLENBQXBCO0FBQ0EsSUFBTSxnQkFBZ0IsU0FBaEIsYUFBZ0IsR0FBTTtBQUMxQixNQUFNLE1BQU0sYUFBYSxnQkFBekI7QUFDQSxNQUFNLGFBQWEsWUFBWSxHQUFaLEVBQW5COztBQUVBLE1BQUksV0FBVyxNQUFYLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLE1BQUUsVUFBRixFQUFjLElBQWQsQ0FBbUIsRUFBbkI7QUFDRDtBQUNELElBQUUsSUFBRixDQUFPLE1BQU0sVUFBYixFQUF5QjtBQUN2QixhQUFTLGlCQUFDLElBQUQsRUFBVTs7QUFFakIsUUFBRSxVQUFGLEVBQWMsSUFBZCxDQUFtQixzREFBbkI7QUFDQSxVQUFNLE9BQU8sRUFBRSxlQUFGLENBQWI7O0FBRUEsVUFBSSxLQUFLLFFBQUwsQ0FBYyxNQUFkLElBQXdCLENBQTVCLEVBQStCO0FBQzdCLGFBQUssTUFBTDtBQUNELE9BRkQsTUFFTztBQUNMLGdCQUFRLEdBQVIsQ0FBWSxLQUFLLFFBQWpCO0FBQ0EsYUFBSyxRQUFMLENBQWMsT0FBZCxDQUFzQixVQUFDLEdBQUQsRUFBUztBQUM3QixlQUFLLE1BQUwsZ0VBQW9FLElBQUksUUFBeEUsbUJBQTZGLElBQUksU0FBakcsb0JBQXlILElBQUksV0FBN0g7QUFDRCxTQUZEO0FBR0Q7QUFDRjtBQWRzQixHQUF6QjtBQWdCRCxDQXZCRDs7QUF5QkEsRUFBRSxjQUFGLEVBQWtCLE1BQWxCLENBQXlCLFVBQUMsQ0FBRCxFQUFPO0FBQzlCLElBQUUsY0FBRjtBQUNBO0FBQ0QsQ0FIRDs7QUFLQSxFQUFFLFdBQUYsRUFBZSxNQUFmLENBQXNCLFVBQUMsQ0FBRCxFQUFPO0FBQzNCLElBQUUsY0FBRjtBQUNBLE1BQUksY0FBYyxFQUFFLFlBQUYsRUFBZ0IsR0FBaEIsRUFBbEI7QUFDQSxNQUFNLE1BQU0sYUFBYSxNQUF6QjtBQUNBLElBQUUsSUFBRixDQUFPLEdBQVAsRUFBWTtBQUNWLFlBQVEsS0FERTtBQUVWLGlCQUFhLGtCQUZIO0FBR1YsVUFBTSxLQUFLLFNBQUwsQ0FBZSxFQUFFLFlBQVksV0FBZCxFQUFmLENBSEk7QUFJVixjQUFVLE1BSkE7QUFLVixhQUFTLGlCQUFDLElBQUQsRUFBVTtBQUNqQixjQUFRLEdBQVIsQ0FBWSxJQUFaOztBQUVBLFFBQUUsVUFBRixFQUFjLElBQWQsQ0FBbUIsOEZBQW5CO0FBQ0EsVUFBTSxPQUFPLEVBQUUsZUFBRixDQUFiOztBQUVBLFdBQUssTUFBTCxnRUFBb0UsS0FBSyxPQUFMLENBQWEsUUFBakYsaUNBQ2dCLEtBQUssT0FBTCxDQUFhLFNBRDdCLGtDQUVXLEtBQUssT0FBTCxDQUFhLFdBRnhCO0FBR0QsS0FkUztBQWVWLFdBQU8sZUFBQyxLQUFELEVBQVEsVUFBUixFQUFvQixXQUFwQixFQUFvQztBQUN4QyxVQUFNLFNBQVMsTUFBTSxZQUFOLENBQW1CLE1BQWxDO0FBQ0EsUUFBRSxVQUFGLEVBQWMsSUFBZCxDQUFtQiw4RkFBbkI7QUFDQSxVQUFJLE1BQUosRUFBWTtBQUNYLFlBQU0sT0FBTyxFQUFFLGVBQUYsQ0FBYjs7QUFFQSxhQUFLLE1BQUwsb0NBQTJDLE1BQTNDO0FBQ0E7QUFDSDtBQXZCUyxHQUFaO0FBeUJELENBN0JEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgYXBpQmFzZVVybCA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgXCIvXCI7XG5jb25zdCBzZWFyY2hJbnB1dCA9ICQoXCIjc2VhcmNoLWlucHV0XCIpO1xuY29uc3QgcGVyZm9ybVNlYXJjaCA9ICgpID0+IHtcbiAgY29uc3QgdXJsID0gYXBpQmFzZVVybCArIFwiL3NlYXJjaD9xdWVyeT1cIjtcbiAgY29uc3Qgc2VhcmNoVGVybSA9IHNlYXJjaElucHV0LnZhbCgpO1xuXG4gIGlmIChzZWFyY2hUZXJtLmxlbmd0aCA8IDEpIHtcbiAgICAkKFwiI3Jlc3VsdHNcIikuaHRtbCgnJyk7XG4gIH1cbiAgJC5hamF4KHVybCArIHNlYXJjaFRlcm0sIHtcbiAgICBzdWNjZXNzOiAoZGF0YSkgPT4ge1xuXG4gICAgICAkKFwiI3Jlc3VsdHNcIikuaHRtbCgnPHVsIGlkPVwicmVzdWx0cy1saXN0XCIgY2xhc3M9XCJsaXN0LWdyb3VwLWZsdXNoXCI+PC91bD4nKTtcbiAgICAgIGNvbnN0IGxpc3QgPSAkKFwiI3Jlc3VsdHMtbGlzdFwiKTtcblxuICAgICAgaWYgKGRhdGEucGFja2FnZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgbGlzdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPjxzdHJvbmc+Tm8gUmVzdWx0cyBGb3VuZDwvc3Ryb25nPjwvbGk+YClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEucGFja2FnZXMpO1xuICAgICAgICBkYXRhLnBhY2thZ2VzLmZvckVhY2goKGRvYykgPT4ge1xuICAgICAgICAgIGxpc3QuYXBwZW5kKGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHtkb2MuaHRtbF91cmx9XCI+PHN0cm9uZz4ke2RvYy5mdWxsX25hbWV9PC9zdHJvbmc+IC0gJHtkb2MuZGVzY3JpcHRpb259PC9hPjwvbGk+YClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuJCgnI3NlYXJjaC1mb3JtJykuc3VibWl0KChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgcGVyZm9ybVNlYXJjaCgpO1xufSk7XG5cbiQoJyNhZGQtZm9ybScpLnN1Ym1pdCgoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGxldCBwYWNrYWdlTmFtZSA9ICQoXCIjYWRkLWlucHV0XCIpLnZhbCgpO1xuICBjb25zdCB1cmwgPSBhcGlCYXNlVXJsICsgXCIvYWRkXCI7XG4gICQuYWpheCh1cmwsIHtcbiAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHsgcmVwb3NpdG9yeTogcGFja2FnZU5hbWUgfSksXG4gICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAgICAgJChcIiNyZXN1bHRzXCIpLmh0bWwoJzxoMyBjbGFzcz1cInRleHQtY2VudGVyIG10LTVcIj5BZGRlZCE8L2gzPjx1bCBpZD1cInJlc3VsdHMtbGlzdFwiIGNsYXNzPVwibGlzdC1ncm91cC1mbHVzaFwiPjwvdWw+Jyk7XG4gICAgICBjb25zdCBsaXN0ID0gJChcIiNyZXN1bHRzLWxpc3RcIik7XG5cbiAgICAgIGxpc3QuYXBwZW5kKGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHtkYXRhLnBhY2thZ2UuaHRtbF91cmx9XCI+XG4gICAgICAgICAgICA8c3Ryb25nPiR7ZGF0YS5wYWNrYWdlLmZ1bGxfbmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAtICR7ZGF0YS5wYWNrYWdlLmRlc2NyaXB0aW9ufTwvYT48L2xpPmApXG4gICAgfSxcbiAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4ge1xuICAgICAgIGNvbnN0IHJlYXNvbiA9IGpxWEhSLnJlc3BvbnNlSlNPTi5yZWFzb25cbiAgICAgICAkKFwiI3Jlc3VsdHNcIikuaHRtbCgnPGgzIGNsYXNzPVwidGV4dC1jZW50ZXIgbXQtNVwiPkVycm9yITwvaDM+PHVsIGlkPVwicmVzdWx0cy1saXN0XCIgY2xhc3M9XCJsaXN0LWdyb3VwLWZsdXNoXCI+PC91bD4nKTtcbiAgICAgICBpZiAocmVhc29uKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSAkKFwiI3Jlc3VsdHMtbGlzdFwiKTtcblxuICAgICAgICBsaXN0LmFwcGVuZChgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+JHtyZWFzb259PC9saT5gKVxuICAgICAgIH1cbiAgICB9XG4gIH0pO1xufSk7Il19

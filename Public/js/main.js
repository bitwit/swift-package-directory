(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var apiBaseUrl = window.location.protocol + "//" + window.location.host;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJQdWJsaWNfc3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sYUFBYSxPQUFPLFFBQVAsQ0FBZ0IsUUFBaEIsR0FBMkIsSUFBM0IsR0FBa0MsT0FBTyxRQUFQLENBQWdCLElBQXJFO0FBQ0EsSUFBTSxjQUFjLEVBQUUsZUFBRixDQUFwQjtBQUNBLElBQU0sZ0JBQWdCLFNBQWhCLGFBQWdCLEdBQU07QUFDMUIsTUFBTSxNQUFNLGFBQWEsZ0JBQXpCO0FBQ0EsTUFBTSxhQUFhLFlBQVksR0FBWixFQUFuQjs7QUFFQSxNQUFJLFdBQVcsTUFBWCxHQUFvQixDQUF4QixFQUEyQjtBQUN6QixNQUFFLFVBQUYsRUFBYyxJQUFkLENBQW1CLEVBQW5CO0FBQ0Q7QUFDRCxJQUFFLElBQUYsQ0FBTyxNQUFNLFVBQWIsRUFBeUI7QUFDdkIsYUFBUyxpQkFBQyxJQUFELEVBQVU7O0FBRWpCLFFBQUUsVUFBRixFQUFjLElBQWQsQ0FBbUIsc0RBQW5CO0FBQ0EsVUFBTSxPQUFPLEVBQUUsZUFBRixDQUFiOztBQUVBLFVBQUksS0FBSyxRQUFMLENBQWMsTUFBZCxJQUF3QixDQUE1QixFQUErQjtBQUM3QixhQUFLLE1BQUw7QUFDRCxPQUZELE1BRU87QUFDTCxnQkFBUSxHQUFSLENBQVksS0FBSyxRQUFqQjtBQUNBLGFBQUssUUFBTCxDQUFjLE9BQWQsQ0FBc0IsVUFBQyxHQUFELEVBQVM7QUFDN0IsZUFBSyxNQUFMLGdFQUFvRSxJQUFJLFFBQXhFLG1CQUE2RixJQUFJLFNBQWpHLG9CQUF5SCxJQUFJLFdBQTdIO0FBQ0QsU0FGRDtBQUdEO0FBQ0Y7QUFkc0IsR0FBekI7QUFnQkQsQ0F2QkQ7O0FBeUJBLEVBQUUsY0FBRixFQUFrQixNQUFsQixDQUF5QixVQUFDLENBQUQsRUFBTztBQUM5QixJQUFFLGNBQUY7QUFDQTtBQUNELENBSEQ7O0FBS0EsRUFBRSxXQUFGLEVBQWUsTUFBZixDQUFzQixVQUFDLENBQUQsRUFBTztBQUMzQixJQUFFLGNBQUY7QUFDQSxNQUFJLGNBQWMsRUFBRSxZQUFGLEVBQWdCLEdBQWhCLEVBQWxCO0FBQ0EsTUFBTSxNQUFNLGFBQWEsTUFBekI7QUFDQSxJQUFFLElBQUYsQ0FBTyxHQUFQLEVBQVk7QUFDVixZQUFRLEtBREU7QUFFVixpQkFBYSxrQkFGSDtBQUdWLFVBQU0sS0FBSyxTQUFMLENBQWUsRUFBRSxZQUFZLFdBQWQsRUFBZixDQUhJO0FBSVYsY0FBVSxNQUpBO0FBS1YsYUFBUyxpQkFBQyxJQUFELEVBQVU7QUFDakIsY0FBUSxHQUFSLENBQVksSUFBWjs7QUFFQSxRQUFFLFVBQUYsRUFBYyxJQUFkLENBQW1CLDhGQUFuQjtBQUNBLFVBQU0sT0FBTyxFQUFFLGVBQUYsQ0FBYjs7QUFFQSxXQUFLLE1BQUwsZ0VBQW9FLEtBQUssT0FBTCxDQUFhLFFBQWpGLGlDQUNnQixLQUFLLE9BQUwsQ0FBYSxTQUQ3QixrQ0FFVyxLQUFLLE9BQUwsQ0FBYSxXQUZ4QjtBQUdELEtBZFM7QUFlVixXQUFPLGVBQUMsS0FBRCxFQUFRLFVBQVIsRUFBb0IsV0FBcEIsRUFBb0M7QUFDeEMsVUFBTSxTQUFTLE1BQU0sWUFBTixDQUFtQixNQUFsQztBQUNBLFFBQUUsVUFBRixFQUFjLElBQWQsQ0FBbUIsOEZBQW5CO0FBQ0EsVUFBSSxNQUFKLEVBQVk7QUFDWCxZQUFNLE9BQU8sRUFBRSxlQUFGLENBQWI7O0FBRUEsYUFBSyxNQUFMLG9DQUEyQyxNQUEzQztBQUNBO0FBQ0g7QUF2QlMsR0FBWjtBQXlCRCxDQTdCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGFwaUJhc2VVcmwgPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdDtcbmNvbnN0IHNlYXJjaElucHV0ID0gJChcIiNzZWFyY2gtaW5wdXRcIik7XG5jb25zdCBwZXJmb3JtU2VhcmNoID0gKCkgPT4ge1xuICBjb25zdCB1cmwgPSBhcGlCYXNlVXJsICsgXCIvc2VhcmNoP3F1ZXJ5PVwiO1xuICBjb25zdCBzZWFyY2hUZXJtID0gc2VhcmNoSW5wdXQudmFsKCk7XG5cbiAgaWYgKHNlYXJjaFRlcm0ubGVuZ3RoIDwgMSkge1xuICAgICQoXCIjcmVzdWx0c1wiKS5odG1sKCcnKTtcbiAgfVxuICAkLmFqYXgodXJsICsgc2VhcmNoVGVybSwge1xuICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB7XG5cbiAgICAgICQoXCIjcmVzdWx0c1wiKS5odG1sKCc8dWwgaWQ9XCJyZXN1bHRzLWxpc3RcIiBjbGFzcz1cImxpc3QtZ3JvdXAtZmx1c2hcIj48L3VsPicpO1xuICAgICAgY29uc3QgbGlzdCA9ICQoXCIjcmVzdWx0cy1saXN0XCIpO1xuXG4gICAgICBpZiAoZGF0YS5wYWNrYWdlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICBsaXN0LmFwcGVuZChgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+PHN0cm9uZz5ObyBSZXN1bHRzIEZvdW5kPC9zdHJvbmc+PC9saT5gKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YS5wYWNrYWdlcyk7XG4gICAgICAgIGRhdGEucGFja2FnZXMuZm9yRWFjaCgoZG9jKSA9PiB7XG4gICAgICAgICAgbGlzdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPjxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke2RvYy5odG1sX3VybH1cIj48c3Ryb25nPiR7ZG9jLmZ1bGxfbmFtZX08L3N0cm9uZz4gLSAke2RvYy5kZXNjcmlwdGlvbn08L2E+PC9saT5gKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4kKCcjc2VhcmNoLWZvcm0nKS5zdWJtaXQoKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBwZXJmb3JtU2VhcmNoKCk7XG59KTtcblxuJCgnI2FkZC1mb3JtJykuc3VibWl0KChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgbGV0IHBhY2thZ2VOYW1lID0gJChcIiNhZGQtaW5wdXRcIikudmFsKCk7XG4gIGNvbnN0IHVybCA9IGFwaUJhc2VVcmwgKyBcIi9hZGRcIjtcbiAgJC5hamF4KHVybCwge1xuICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoeyByZXBvc2l0b3J5OiBwYWNrYWdlTmFtZSB9KSxcbiAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgc3VjY2VzczogKGRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgICAkKFwiI3Jlc3VsdHNcIikuaHRtbCgnPGgzIGNsYXNzPVwidGV4dC1jZW50ZXIgbXQtNVwiPkFkZGVkITwvaDM+PHVsIGlkPVwicmVzdWx0cy1saXN0XCIgY2xhc3M9XCJsaXN0LWdyb3VwLWZsdXNoXCI+PC91bD4nKTtcbiAgICAgIGNvbnN0IGxpc3QgPSAkKFwiI3Jlc3VsdHMtbGlzdFwiKTtcblxuICAgICAgbGlzdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPjxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCIke2RhdGEucGFja2FnZS5odG1sX3VybH1cIj5cbiAgICAgICAgICAgIDxzdHJvbmc+JHtkYXRhLnBhY2thZ2UuZnVsbF9uYW1lfTwvc3Ryb25nPlxuICAgICAgICAgICAgIC0gJHtkYXRhLnBhY2thZ2UuZGVzY3JpcHRpb259PC9hPjwvbGk+YClcbiAgICB9LFxuICAgIGVycm9yOiAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSA9PiB7XG4gICAgICAgY29uc3QgcmVhc29uID0ganFYSFIucmVzcG9uc2VKU09OLnJlYXNvblxuICAgICAgICQoXCIjcmVzdWx0c1wiKS5odG1sKCc8aDMgY2xhc3M9XCJ0ZXh0LWNlbnRlciBtdC01XCI+RXJyb3IhPC9oMz48dWwgaWQ9XCJyZXN1bHRzLWxpc3RcIiBjbGFzcz1cImxpc3QtZ3JvdXAtZmx1c2hcIj48L3VsPicpO1xuICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgY29uc3QgbGlzdCA9ICQoXCIjcmVzdWx0cy1saXN0XCIpO1xuXG4gICAgICAgIGxpc3QuYXBwZW5kKGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj4ke3JlYXNvbn08L2xpPmApXG4gICAgICAgfVxuICAgIH1cbiAgfSk7XG59KTsiXX0=

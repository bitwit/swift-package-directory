(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var apiBaseUrl = "/";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJQdWJsaWNfc3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sYUFBYSxHQUFuQjtBQUNBLElBQU0sY0FBYyxFQUFFLGVBQUYsQ0FBcEI7QUFDQSxJQUFNLGdCQUFnQixTQUFoQixhQUFnQixHQUFNO0FBQzFCLE1BQU0sTUFBTSxhQUFhLGdCQUF6QjtBQUNBLE1BQU0sYUFBYSxZQUFZLEdBQVosRUFBbkI7O0FBRUEsTUFBSSxXQUFXLE1BQVgsR0FBb0IsQ0FBeEIsRUFBMkI7QUFDekIsTUFBRSxVQUFGLEVBQWMsSUFBZCxDQUFtQixFQUFuQjtBQUNEO0FBQ0QsSUFBRSxJQUFGLENBQU8sTUFBTSxVQUFiLEVBQXlCO0FBQ3ZCLGFBQVMsaUJBQUMsSUFBRCxFQUFVOztBQUVqQixRQUFFLFVBQUYsRUFBYyxJQUFkLENBQW1CLHNEQUFuQjtBQUNBLFVBQU0sT0FBTyxFQUFFLGVBQUYsQ0FBYjs7QUFFQSxVQUFJLEtBQUssUUFBTCxDQUFjLE1BQWQsSUFBd0IsQ0FBNUIsRUFBK0I7QUFDN0IsYUFBSyxNQUFMO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZ0JBQVEsR0FBUixDQUFZLEtBQUssUUFBakI7QUFDQSxhQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLFVBQUMsR0FBRCxFQUFTO0FBQzdCLGVBQUssTUFBTCxnRUFBb0UsSUFBSSxRQUF4RSxtQkFBNkYsSUFBSSxTQUFqRyxvQkFBeUgsSUFBSSxXQUE3SDtBQUNELFNBRkQ7QUFHRDtBQUNGO0FBZHNCLEdBQXpCO0FBZ0JELENBdkJEOztBQXlCQSxFQUFFLGNBQUYsRUFBa0IsTUFBbEIsQ0FBeUIsVUFBQyxDQUFELEVBQU87QUFDOUIsSUFBRSxjQUFGO0FBQ0E7QUFDRCxDQUhEOztBQUtBLEVBQUUsV0FBRixFQUFlLE1BQWYsQ0FBc0IsVUFBQyxDQUFELEVBQU87QUFDM0IsSUFBRSxjQUFGO0FBQ0EsTUFBSSxjQUFjLEVBQUUsWUFBRixFQUFnQixHQUFoQixFQUFsQjtBQUNBLE1BQU0sTUFBTSxhQUFhLE1BQXpCO0FBQ0EsSUFBRSxJQUFGLENBQU8sR0FBUCxFQUFZO0FBQ1YsWUFBUSxLQURFO0FBRVYsaUJBQWEsa0JBRkg7QUFHVixVQUFNLEtBQUssU0FBTCxDQUFlLEVBQUUsWUFBWSxXQUFkLEVBQWYsQ0FISTtBQUlWLGNBQVUsTUFKQTtBQUtWLGFBQVMsaUJBQUMsSUFBRCxFQUFVO0FBQ2pCLGNBQVEsR0FBUixDQUFZLElBQVo7O0FBRUEsUUFBRSxVQUFGLEVBQWMsSUFBZCxDQUFtQiw4RkFBbkI7QUFDQSxVQUFNLE9BQU8sRUFBRSxlQUFGLENBQWI7O0FBRUEsV0FBSyxNQUFMLGdFQUFvRSxLQUFLLE9BQUwsQ0FBYSxRQUFqRixpQ0FDZ0IsS0FBSyxPQUFMLENBQWEsU0FEN0Isa0NBRVcsS0FBSyxPQUFMLENBQWEsV0FGeEI7QUFHRCxLQWRTO0FBZVYsV0FBTyxlQUFDLEtBQUQsRUFBUSxVQUFSLEVBQW9CLFdBQXBCLEVBQW9DO0FBQ3hDLFVBQU0sU0FBUyxNQUFNLFlBQU4sQ0FBbUIsTUFBbEM7QUFDQSxRQUFFLFVBQUYsRUFBYyxJQUFkLENBQW1CLDhGQUFuQjtBQUNBLFVBQUksTUFBSixFQUFZO0FBQ1gsWUFBTSxPQUFPLEVBQUUsZUFBRixDQUFiOztBQUVBLGFBQUssTUFBTCxvQ0FBMkMsTUFBM0M7QUFDQTtBQUNIO0FBdkJTLEdBQVo7QUF5QkQsQ0E3QkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBhcGlCYXNlVXJsID0gXCIvXCI7XG5jb25zdCBzZWFyY2hJbnB1dCA9ICQoXCIjc2VhcmNoLWlucHV0XCIpO1xuY29uc3QgcGVyZm9ybVNlYXJjaCA9ICgpID0+IHtcbiAgY29uc3QgdXJsID0gYXBpQmFzZVVybCArIFwiL3NlYXJjaD9xdWVyeT1cIjtcbiAgY29uc3Qgc2VhcmNoVGVybSA9IHNlYXJjaElucHV0LnZhbCgpO1xuXG4gIGlmIChzZWFyY2hUZXJtLmxlbmd0aCA8IDEpIHtcbiAgICAkKFwiI3Jlc3VsdHNcIikuaHRtbCgnJyk7XG4gIH1cbiAgJC5hamF4KHVybCArIHNlYXJjaFRlcm0sIHtcbiAgICBzdWNjZXNzOiAoZGF0YSkgPT4ge1xuXG4gICAgICAkKFwiI3Jlc3VsdHNcIikuaHRtbCgnPHVsIGlkPVwicmVzdWx0cy1saXN0XCIgY2xhc3M9XCJsaXN0LWdyb3VwLWZsdXNoXCI+PC91bD4nKTtcbiAgICAgIGNvbnN0IGxpc3QgPSAkKFwiI3Jlc3VsdHMtbGlzdFwiKTtcblxuICAgICAgaWYgKGRhdGEucGFja2FnZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgbGlzdC5hcHBlbmQoYDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPjxzdHJvbmc+Tm8gUmVzdWx0cyBGb3VuZDwvc3Ryb25nPjwvbGk+YClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEucGFja2FnZXMpO1xuICAgICAgICBkYXRhLnBhY2thZ2VzLmZvckVhY2goKGRvYykgPT4ge1xuICAgICAgICAgIGxpc3QuYXBwZW5kKGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHtkb2MuaHRtbF91cmx9XCI+PHN0cm9uZz4ke2RvYy5mdWxsX25hbWV9PC9zdHJvbmc+IC0gJHtkb2MuZGVzY3JpcHRpb259PC9hPjwvbGk+YClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuJCgnI3NlYXJjaC1mb3JtJykuc3VibWl0KChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgcGVyZm9ybVNlYXJjaCgpO1xufSk7XG5cbiQoJyNhZGQtZm9ybScpLnN1Ym1pdCgoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGxldCBwYWNrYWdlTmFtZSA9ICQoXCIjYWRkLWlucHV0XCIpLnZhbCgpO1xuICBjb25zdCB1cmwgPSBhcGlCYXNlVXJsICsgXCIvYWRkXCI7XG4gICQuYWpheCh1cmwsIHtcbiAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHsgcmVwb3NpdG9yeTogcGFja2FnZU5hbWUgfSksXG4gICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAgICAgJChcIiNyZXN1bHRzXCIpLmh0bWwoJzxoMyBjbGFzcz1cInRleHQtY2VudGVyIG10LTVcIj5BZGRlZCE8L2gzPjx1bCBpZD1cInJlc3VsdHMtbGlzdFwiIGNsYXNzPVwibGlzdC1ncm91cC1mbHVzaFwiPjwvdWw+Jyk7XG4gICAgICBjb25zdCBsaXN0ID0gJChcIiNyZXN1bHRzLWxpc3RcIik7XG5cbiAgICAgIGxpc3QuYXBwZW5kKGA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj48YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHtkYXRhLnBhY2thZ2UuaHRtbF91cmx9XCI+XG4gICAgICAgICAgICA8c3Ryb25nPiR7ZGF0YS5wYWNrYWdlLmZ1bGxfbmFtZX08L3N0cm9uZz5cbiAgICAgICAgICAgICAtICR7ZGF0YS5wYWNrYWdlLmRlc2NyaXB0aW9ufTwvYT48L2xpPmApXG4gICAgfSxcbiAgICBlcnJvcjogKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgPT4ge1xuICAgICAgIGNvbnN0IHJlYXNvbiA9IGpxWEhSLnJlc3BvbnNlSlNPTi5yZWFzb25cbiAgICAgICAkKFwiI3Jlc3VsdHNcIikuaHRtbCgnPGgzIGNsYXNzPVwidGV4dC1jZW50ZXIgbXQtNVwiPkVycm9yITwvaDM+PHVsIGlkPVwicmVzdWx0cy1saXN0XCIgY2xhc3M9XCJsaXN0LWdyb3VwLWZsdXNoXCI+PC91bD4nKTtcbiAgICAgICBpZiAocmVhc29uKSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSAkKFwiI3Jlc3VsdHMtbGlzdFwiKTtcblxuICAgICAgICBsaXN0LmFwcGVuZChgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+JHtyZWFzb259PC9saT5gKVxuICAgICAgIH1cbiAgICB9XG4gIH0pO1xufSk7Il19

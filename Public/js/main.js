(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var vm = new Vue({
  el: '#app',
  data: {
    apiBaseUrl: "https://api.swiftpackage.directory",
    searchQuery: "",
    searchResults: null,
    addRepositoryName: "",
    error: null
  },
  created: function created() {
    console.log('created view instance', this);
    this.searchQuery = "s";
    this.performSearch();
  },
  methods: {
    performSearch: function performSearch(e) {
      var _this = this;

      if (this.searchQuery.length === 0) {
        this.searchResults = [];
        return;
      }
      var url = this.apiBaseUrl + "/search?query=" + this.searchQuery;
      this.$http.get(url).then(function (response) {
        var pkgs = response.body.packages;
        pkgs.forEach(function (element) {
          appendPackageDependencyString(element);
        });
        _this.searchResults = pkgs;
      }, function (error) {
        console.log(error);
      });
    },
    addPackage: function addPackage() {
      var _this2 = this;

      var url = this.apiBaseUrl + "/add";
      this.$http.put(url, { repository: this.addRepositoryName }).then(function (response) {
        var pkg = response.body.package;
        appendPackageDependencyString(pkg);
        _this2.searchResults = [pkg];
      }, function (error) {
        console.log(error);
        _this2.error = "Package not found";
        _this2.searchResults = [];
      });
    },
    copyPackageDependencyString: function copyPackageDependencyString(pkg, event) {
      event.target.nextSibling.select();
      document.execCommand('copy');
    }
  }
});

function appendPackageDependencyString(pkg) {
  pkg.dependency_string = ".package(url: \"https://github.com/" + pkg.full_name + ".git\", from: \"" + pkg.latest_tag + "\")";
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJQdWJsaWNfc3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksS0FBSyxJQUFJLEdBQUosQ0FBUTtBQUNmLE1BQUksTUFEVztBQUVmLFFBQU07QUFDSixnQkFBWSxvQ0FEUjtBQUVKLGlCQUFhLEVBRlQ7QUFHSixtQkFBZSxJQUhYO0FBSUosdUJBQW1CLEVBSmY7QUFLSixXQUFPO0FBTEgsR0FGUztBQVNmLFdBQVMsbUJBQVk7QUFDbkIsWUFBUSxHQUFSLENBQVksdUJBQVosRUFBcUMsSUFBckM7QUFDQSxTQUFLLFdBQUwsR0FBbUIsR0FBbkI7QUFDQSxTQUFLLGFBQUw7QUFDRCxHQWJjO0FBY2YsV0FBUztBQUNQLG1CQUFlLHVCQUFVLENBQVYsRUFBYTtBQUFBOztBQUMxQixVQUFJLEtBQUssV0FBTCxDQUFpQixNQUFqQixLQUE0QixDQUFoQyxFQUFtQztBQUNqQyxhQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDQTtBQUNEO0FBQ0QsVUFBTSxNQUFTLEtBQUssVUFBZCxzQkFBeUMsS0FBSyxXQUFwRDtBQUNBLFdBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxHQUFmLEVBQW9CLElBQXBCLENBQXlCLG9CQUFZO0FBQ25DLFlBQU0sT0FBTyxTQUFTLElBQVQsQ0FBYyxRQUEzQjtBQUNBLGFBQUssT0FBTCxDQUFhLG1CQUFXO0FBQ3RCLHdDQUE4QixPQUE5QjtBQUNELFNBRkQ7QUFHQSxjQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDRCxPQU5ELEVBTUcsaUJBQVM7QUFDVixnQkFBUSxHQUFSLENBQVksS0FBWjtBQUNELE9BUkQ7QUFTRCxLQWhCTTtBQWlCUCxnQkFBWSxzQkFBWTtBQUFBOztBQUN0QixVQUFNLE1BQVMsS0FBSyxVQUFkLFNBQU47QUFDQSxXQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsR0FBZixFQUFvQixFQUFFLFlBQVksS0FBSyxpQkFBbkIsRUFBcEIsRUFDQyxJQURELENBQ00sb0JBQVk7QUFDaEIsWUFBTSxNQUFNLFNBQVMsSUFBVCxDQUFjLE9BQTFCO0FBQ0Esc0NBQThCLEdBQTlCO0FBQ0EsZUFBSyxhQUFMLEdBQXFCLENBQUMsR0FBRCxDQUFyQjtBQUNELE9BTEQsRUFLRyxpQkFBUztBQUNWLGdCQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0EsZUFBSyxLQUFMLEdBQWEsbUJBQWI7QUFDQSxlQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDRCxPQVREO0FBVUQsS0E3Qk07QUE4QlAsaUNBQTZCLHFDQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCO0FBQ2pELFlBQU0sTUFBTixDQUFhLFdBQWIsQ0FBeUIsTUFBekI7QUFDQSxlQUFTLFdBQVQsQ0FBcUIsTUFBckI7QUFDRDtBQWpDTTtBQWRNLENBQVIsQ0FBVDs7QUFtREEsU0FBUyw2QkFBVCxDQUF1QyxHQUF2QyxFQUE0QztBQUMxQyxNQUFJLGlCQUFKLDJDQUE2RCxJQUFJLFNBQWpFLHdCQUEyRixJQUFJLFVBQS9GO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJ2YXIgdm0gPSBuZXcgVnVlKHtcbiAgZWw6ICcjYXBwJyxcbiAgZGF0YToge1xuICAgIGFwaUJhc2VVcmw6IFwiaHR0cHM6Ly9hcGkuc3dpZnRwYWNrYWdlLmRpcmVjdG9yeVwiLFxuICAgIHNlYXJjaFF1ZXJ5OiBcIlwiLFxuICAgIHNlYXJjaFJlc3VsdHM6IG51bGwsXG4gICAgYWRkUmVwb3NpdG9yeU5hbWU6IFwiXCIsXG4gICAgZXJyb3I6IG51bGxcbiAgfSxcbiAgY3JlYXRlZDogZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdjcmVhdGVkIHZpZXcgaW5zdGFuY2UnLCB0aGlzKTtcbiAgICB0aGlzLnNlYXJjaFF1ZXJ5ID0gXCJzXCI7XG4gICAgdGhpcy5wZXJmb3JtU2VhcmNoKCk7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBwZXJmb3JtU2VhcmNoOiBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0cyA9IFtdO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmFwaUJhc2VVcmx9L3NlYXJjaD9xdWVyeT0ke3RoaXMuc2VhcmNoUXVlcnl9YDtcbiAgICAgIHRoaXMuJGh0dHAuZ2V0KHVybCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGNvbnN0IHBrZ3MgPSByZXNwb25zZS5ib2R5LnBhY2thZ2VzO1xuICAgICAgICBwa2dzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgYXBwZW5kUGFja2FnZURlcGVuZGVuY3lTdHJpbmcoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNlYXJjaFJlc3VsdHMgPSBwa2dzO1xuICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGFkZFBhY2thZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IHVybCA9IGAke3RoaXMuYXBpQmFzZVVybH0vYWRkYDtcbiAgICAgIHRoaXMuJGh0dHAucHV0KHVybCwgeyByZXBvc2l0b3J5OiB0aGlzLmFkZFJlcG9zaXRvcnlOYW1lIH0pXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGNvbnN0IHBrZyA9IHJlc3BvbnNlLmJvZHkucGFja2FnZVxuICAgICAgICBhcHBlbmRQYWNrYWdlRGVwZW5kZW5jeVN0cmluZyhwa2cpXG4gICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0cyA9IFtwa2ddXG4gICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgdGhpcy5lcnJvciA9IFwiUGFja2FnZSBub3QgZm91bmRcIjtcbiAgICAgICAgdGhpcy5zZWFyY2hSZXN1bHRzID0gW11cbiAgICAgIH0pXG4gICAgfSxcbiAgICBjb3B5UGFja2FnZURlcGVuZGVuY3lTdHJpbmc6IGZ1bmN0aW9uIChwa2csIGV2ZW50KSB7XG4gICAgICBldmVudC50YXJnZXQubmV4dFNpYmxpbmcuc2VsZWN0KCk7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICAgIH1cbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGFwcGVuZFBhY2thZ2VEZXBlbmRlbmN5U3RyaW5nKHBrZykge1xuICBwa2cuZGVwZW5kZW5jeV9zdHJpbmcgPSBgLnBhY2thZ2UodXJsOiBcImh0dHBzOi8vZ2l0aHViLmNvbS8ke3BrZy5mdWxsX25hbWV9LmdpdFwiLCBmcm9tOiBcIiR7cGtnLmxhdGVzdF90YWd9XCIpYDtcbn0iXX0=

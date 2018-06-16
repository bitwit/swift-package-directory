(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var navApp = new Vue({
  el: '#nav-app',
  data: {
    isExpanded: false
  },
  methods: {
    toggle: function toggle() {
      this.isExpanded = !this.isExpanded;
    }
  }
});
var vm = new Vue({
  el: '#app',
  data: {
    apiBaseUrl: "https://api.swiftpackage.directory",
    searchQuery: "",
    popularResults: null,
    searchResults: null,
    addRepositoryName: "",
    error: null
  },
  created: function created() {
    this.getPopular();
  },
  methods: {
    getPopular: function getPopular() {
      var _this = this;

      var url = this.apiBaseUrl + '/popular';
      this.$http.get(url).then(function (response) {
        _this.popularResults = response.body.packages.map(function (element) {
          appendPackageDependencyString(element);
          return element;
        });
        console.log(_this.popularResults);
      }, function (error) {
        console.log(error);
      });
    },
    performSearch: _.debounce(function (e) {
      var _this2 = this;

      if (this.searchQuery.length === 0) {
        this.searchResults = [];
        return;
      }
      var url = this.apiBaseUrl + '/search?query=' + this.searchQuery;
      this.$http.get(url).then(function (response) {
        _this2.searchResults = response.body.packages.map(function (element) {
          appendPackageDependencyString(element);
          return element;
        });
      }, function (error) {
        console.log(error);
      });
    }, 200),
    addPackage: function addPackage() {
      var _this3 = this;

      var url = this.apiBaseUrl + '/add';
      this.$http.put(url, { repository: this.addRepositoryName }).then(function (response) {
        var pkg = response.body.package;
        appendPackageDependencyString(pkg);
        _this3.searchResults = [pkg];
      }, function (error) {
        console.log(error);
        _this3.error = "Package not found";
        _this3.searchResults = [];
      });
    },
    copyPackageDependencyString: function copyPackageDependencyString(pkg, event) {
      event.target.previousSibling.select();
      document.execCommand('copy');
    }
  }
});

function appendPackageDependencyString(pkg) {
  pkg.dependency_string = '.package(url: "https://github.com/' + pkg.full_name + '.git", from: "' + pkg.latest_tag + '")';
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJQdWJsaWNfc3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksU0FBUyxJQUFJLEdBQUosQ0FBUTtBQUNuQixNQUFJLFVBRGU7QUFFbkIsUUFBTTtBQUNKLGdCQUFZO0FBRFIsR0FGYTtBQUtuQixXQUFTO0FBQ1AsWUFBUSxrQkFBWTtBQUNsQixXQUFLLFVBQUwsR0FBa0IsQ0FBQyxLQUFLLFVBQXhCO0FBQ0Q7QUFITTtBQUxVLENBQVIsQ0FBYjtBQVdBLElBQUksS0FBSyxJQUFJLEdBQUosQ0FBUTtBQUNmLE1BQUksTUFEVztBQUVmLFFBQU07QUFDSixnQkFBWSxvQ0FEUjtBQUVKLGlCQUFhLEVBRlQ7QUFHSixvQkFBZ0IsSUFIWjtBQUlKLG1CQUFlLElBSlg7QUFLSix1QkFBbUIsRUFMZjtBQU1KLFdBQU87QUFOSCxHQUZTO0FBVWYsV0FBUyxtQkFBWTtBQUNuQixTQUFLLFVBQUw7QUFDRCxHQVpjO0FBYWYsV0FBUztBQUNQLGdCQUFZLHNCQUFZO0FBQUE7O0FBQ3RCLFVBQU0sTUFBUyxLQUFLLFVBQWQsYUFBTjtBQUNBLFdBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxHQUFmLEVBQW9CLElBQXBCLENBQXlCLG9CQUFZO0FBQ25DLGNBQUssY0FBTCxHQUFzQixTQUFTLElBQVQsQ0FBYyxRQUFkLENBQXVCLEdBQXZCLENBQTJCLG1CQUFXO0FBQzFELHdDQUE4QixPQUE5QjtBQUNBLGlCQUFPLE9BQVA7QUFDRCxTQUhxQixDQUF0QjtBQUlBLGdCQUFRLEdBQVIsQ0FBWSxNQUFLLGNBQWpCO0FBQ0QsT0FORCxFQU1HLGlCQUFTO0FBQ1YsZ0JBQVEsR0FBUixDQUFZLEtBQVo7QUFDRCxPQVJEO0FBU0QsS0FaTTtBQWFQLG1CQUFlLEVBQUUsUUFBRixDQUFXLFVBQVUsQ0FBVixFQUFhO0FBQUE7O0FBQ3JDLFVBQUksS0FBSyxXQUFMLENBQWlCLE1BQWpCLEtBQTRCLENBQWhDLEVBQW1DO0FBQ2pDLGFBQUssYUFBTCxHQUFxQixFQUFyQjtBQUNBO0FBQ0Q7QUFDRCxVQUFNLE1BQVMsS0FBSyxVQUFkLHNCQUF5QyxLQUFLLFdBQXBEO0FBQ0EsV0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLEdBQWYsRUFBb0IsSUFBcEIsQ0FBeUIsb0JBQVk7QUFDbkMsZUFBSyxhQUFMLEdBQXFCLFNBQVMsSUFBVCxDQUFjLFFBQWQsQ0FBdUIsR0FBdkIsQ0FBMkIsbUJBQVc7QUFDekQsd0NBQThCLE9BQTlCO0FBQ0EsaUJBQU8sT0FBUDtBQUNELFNBSG9CLENBQXJCO0FBSUQsT0FMRCxFQUtHLGlCQUFTO0FBQ1YsZ0JBQVEsR0FBUixDQUFZLEtBQVo7QUFDRCxPQVBEO0FBUUQsS0FkYyxFQWNaLEdBZFksQ0FiUjtBQTRCUCxnQkFBWSxzQkFBWTtBQUFBOztBQUN0QixVQUFNLE1BQVMsS0FBSyxVQUFkLFNBQU47QUFDQSxXQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsR0FBZixFQUFvQixFQUFFLFlBQVksS0FBSyxpQkFBbkIsRUFBcEIsRUFDQyxJQURELENBQ00sb0JBQVk7QUFDaEIsWUFBTSxNQUFNLFNBQVMsSUFBVCxDQUFjLE9BQTFCO0FBQ0Esc0NBQThCLEdBQTlCO0FBQ0EsZUFBSyxhQUFMLEdBQXFCLENBQUMsR0FBRCxDQUFyQjtBQUNELE9BTEQsRUFLRyxpQkFBUztBQUNWLGdCQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0EsZUFBSyxLQUFMLEdBQWEsbUJBQWI7QUFDQSxlQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDRCxPQVREO0FBVUQsS0F4Q007QUF5Q1AsaUNBQTZCLHFDQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCO0FBQ2pELFlBQU0sTUFBTixDQUFhLGVBQWIsQ0FBNkIsTUFBN0I7QUFDQSxlQUFTLFdBQVQsQ0FBcUIsTUFBckI7QUFDRDtBQTVDTTtBQWJNLENBQVIsQ0FBVDs7QUE2REEsU0FBUyw2QkFBVCxDQUF1QyxHQUF2QyxFQUE0QztBQUMxQyxNQUFJLGlCQUFKLDBDQUE2RCxJQUFJLFNBQWpFLHNCQUEyRixJQUFJLFVBQS9GO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJ2YXIgbmF2QXBwID0gbmV3IFZ1ZSh7XG4gIGVsOiAnI25hdi1hcHAnLFxuICBkYXRhOiB7XG4gICAgaXNFeHBhbmRlZDogZmFsc2VcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIHRvZ2dsZTogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5pc0V4cGFuZGVkID0gIXRoaXMuaXNFeHBhbmRlZDtcbiAgICB9XG4gIH1cbn0pXG52YXIgdm0gPSBuZXcgVnVlKHtcbiAgZWw6ICcjYXBwJyxcbiAgZGF0YToge1xuICAgIGFwaUJhc2VVcmw6IFwiaHR0cHM6Ly9hcGkuc3dpZnRwYWNrYWdlLmRpcmVjdG9yeVwiLFxuICAgIHNlYXJjaFF1ZXJ5OiBcIlwiLFxuICAgIHBvcHVsYXJSZXN1bHRzOiBudWxsLFxuICAgIHNlYXJjaFJlc3VsdHM6IG51bGwsXG4gICAgYWRkUmVwb3NpdG9yeU5hbWU6IFwiXCIsXG4gICAgZXJyb3I6IG51bGxcbiAgfSxcbiAgY3JlYXRlZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZ2V0UG9wdWxhcigpO1xuICB9LFxuICBtZXRob2RzOiB7XG4gICAgZ2V0UG9wdWxhcjogZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgdXJsID0gYCR7dGhpcy5hcGlCYXNlVXJsfS9wb3B1bGFyYDtcbiAgICAgIHRoaXMuJGh0dHAuZ2V0KHVybCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIHRoaXMucG9wdWxhclJlc3VsdHMgPSByZXNwb25zZS5ib2R5LnBhY2thZ2VzLm1hcChlbGVtZW50ID0+IHtcbiAgICAgICAgICBhcHBlbmRQYWNrYWdlRGVwZW5kZW5jeVN0cmluZyhlbGVtZW50KTtcbiAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucG9wdWxhclJlc3VsdHMpO1xuICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHBlcmZvcm1TZWFyY2g6IF8uZGVib3VuY2UoZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmICh0aGlzLnNlYXJjaFF1ZXJ5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLnNlYXJjaFJlc3VsdHMgPSBbXTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgdXJsID0gYCR7dGhpcy5hcGlCYXNlVXJsfS9zZWFyY2g/cXVlcnk9JHt0aGlzLnNlYXJjaFF1ZXJ5fWA7XG4gICAgICB0aGlzLiRodHRwLmdldCh1cmwpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICB0aGlzLnNlYXJjaFJlc3VsdHMgPSByZXNwb25zZS5ib2R5LnBhY2thZ2VzLm1hcChlbGVtZW50ID0+IHtcbiAgICAgICAgICBhcHBlbmRQYWNrYWdlRGVwZW5kZW5jeVN0cmluZyhlbGVtZW50KTtcbiAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfSk7XG4gICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0sIDIwMCksXG4gICAgYWRkUGFja2FnZTogZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgdXJsID0gYCR7dGhpcy5hcGlCYXNlVXJsfS9hZGRgO1xuICAgICAgdGhpcy4kaHR0cC5wdXQodXJsLCB7IHJlcG9zaXRvcnk6IHRoaXMuYWRkUmVwb3NpdG9yeU5hbWUgfSlcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgY29uc3QgcGtnID0gcmVzcG9uc2UuYm9keS5wYWNrYWdlXG4gICAgICAgIGFwcGVuZFBhY2thZ2VEZXBlbmRlbmN5U3RyaW5nKHBrZylcbiAgICAgICAgdGhpcy5zZWFyY2hSZXN1bHRzID0gW3BrZ11cbiAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICB0aGlzLmVycm9yID0gXCJQYWNrYWdlIG5vdCBmb3VuZFwiO1xuICAgICAgICB0aGlzLnNlYXJjaFJlc3VsdHMgPSBbXVxuICAgICAgfSlcbiAgICB9LFxuICAgIGNvcHlQYWNrYWdlRGVwZW5kZW5jeVN0cmluZzogZnVuY3Rpb24gKHBrZywgZXZlbnQpIHtcbiAgICAgIGV2ZW50LnRhcmdldC5wcmV2aW91c1NpYmxpbmcuc2VsZWN0KCk7XG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICAgIH1cbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGFwcGVuZFBhY2thZ2VEZXBlbmRlbmN5U3RyaW5nKHBrZykge1xuICBwa2cuZGVwZW5kZW5jeV9zdHJpbmcgPSBgLnBhY2thZ2UodXJsOiBcImh0dHBzOi8vZ2l0aHViLmNvbS8ke3BrZy5mdWxsX25hbWV9LmdpdFwiLCBmcm9tOiBcIiR7cGtnLmxhdGVzdF90YWd9XCIpYDtcbn0iXX0=

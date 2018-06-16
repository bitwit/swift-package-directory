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
    var uri = window.location.search.substring(1);
    var params = new URLSearchParams(uri);
    var searchQuery = params.get("query");
    if (searchQuery) {
      this.searchQuery = searchQuery;
      this.performSearch();
    }
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
    },
    searchTopic: function searchTopic(topic) {
      window.location.href = '/?query=' + topic;
    },
    firstSixTopics: function firstSixTopics(pkg) {
      if (pkg.topics.length < 6) {
        return pkg.topics;
      }
      return pkg.topics.slice(0, 6);
    }
  }
});

function appendPackageDependencyString(pkg) {
  pkg.dependency_string = '.package(url: "https://github.com/' + pkg.full_name + '.git", from: "' + pkg.latest_tag + '")';
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJQdWJsaWNfc3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksU0FBUyxJQUFJLEdBQUosQ0FBUTtBQUNuQixNQUFJLFVBRGU7QUFFbkIsUUFBTTtBQUNKLGdCQUFZO0FBRFIsR0FGYTtBQUtuQixXQUFTO0FBQ1AsWUFBUSxrQkFBWTtBQUNsQixXQUFLLFVBQUwsR0FBa0IsQ0FBQyxLQUFLLFVBQXhCO0FBQ0Q7QUFITTtBQUxVLENBQVIsQ0FBYjtBQVdBLElBQUksS0FBSyxJQUFJLEdBQUosQ0FBUTtBQUNmLE1BQUksTUFEVztBQUVmLFFBQU07QUFDSixnQkFBWSxvQ0FEUjtBQUVKLGlCQUFhLEVBRlQ7QUFHSixvQkFBZ0IsSUFIWjtBQUlKLG1CQUFlLElBSlg7QUFLSix1QkFBbUIsRUFMZjtBQU1KLFdBQU87QUFOSCxHQUZTO0FBVWYsV0FBUyxtQkFBWTtBQUNuQixRQUFJLE1BQU0sT0FBTyxRQUFQLENBQWdCLE1BQWhCLENBQXVCLFNBQXZCLENBQWlDLENBQWpDLENBQVY7QUFDQSxRQUFJLFNBQVMsSUFBSSxlQUFKLENBQW9CLEdBQXBCLENBQWI7QUFDQSxRQUFJLGNBQWMsT0FBTyxHQUFQLENBQVcsT0FBWCxDQUFsQjtBQUNBLFFBQUcsV0FBSCxFQUFnQjtBQUNkLFdBQUssV0FBTCxHQUFtQixXQUFuQjtBQUNBLFdBQUssYUFBTDtBQUNEO0FBQ0QsU0FBSyxVQUFMO0FBQ0QsR0FuQmM7QUFvQmYsV0FBUztBQUNQLGdCQUFZLHNCQUFZO0FBQUE7O0FBQ3RCLFVBQU0sTUFBUyxLQUFLLFVBQWQsYUFBTjtBQUNBLFdBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxHQUFmLEVBQW9CLElBQXBCLENBQXlCLG9CQUFZO0FBQ25DLGNBQUssY0FBTCxHQUFzQixTQUFTLElBQVQsQ0FBYyxRQUFkLENBQXVCLEdBQXZCLENBQTJCLG1CQUFXO0FBQzFELHdDQUE4QixPQUE5QjtBQUNBLGlCQUFPLE9BQVA7QUFDRCxTQUhxQixDQUF0QjtBQUlBLGdCQUFRLEdBQVIsQ0FBWSxNQUFLLGNBQWpCO0FBQ0QsT0FORCxFQU1HLGlCQUFTO0FBQ1YsZ0JBQVEsR0FBUixDQUFZLEtBQVo7QUFDRCxPQVJEO0FBU0QsS0FaTTtBQWFQLG1CQUFlLEVBQUUsUUFBRixDQUFXLFVBQVUsQ0FBVixFQUFhO0FBQUE7O0FBQ3JDLFVBQUksS0FBSyxXQUFMLENBQWlCLE1BQWpCLEtBQTRCLENBQWhDLEVBQW1DO0FBQ2pDLGFBQUssYUFBTCxHQUFxQixFQUFyQjtBQUNBO0FBQ0Q7QUFDRCxVQUFNLE1BQVMsS0FBSyxVQUFkLHNCQUF5QyxLQUFLLFdBQXBEO0FBQ0EsV0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLEdBQWYsRUFBb0IsSUFBcEIsQ0FBeUIsb0JBQVk7QUFDbkMsZUFBSyxhQUFMLEdBQXFCLFNBQVMsSUFBVCxDQUFjLFFBQWQsQ0FBdUIsR0FBdkIsQ0FBMkIsbUJBQVc7QUFDekQsd0NBQThCLE9BQTlCO0FBQ0EsaUJBQU8sT0FBUDtBQUNELFNBSG9CLENBQXJCO0FBSUQsT0FMRCxFQUtHLGlCQUFTO0FBQ1YsZ0JBQVEsR0FBUixDQUFZLEtBQVo7QUFDRCxPQVBEO0FBUUQsS0FkYyxFQWNaLEdBZFksQ0FiUjtBQTRCUCxnQkFBWSxzQkFBWTtBQUFBOztBQUN0QixVQUFNLE1BQVMsS0FBSyxVQUFkLFNBQU47QUFDQSxXQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsR0FBZixFQUFvQixFQUFFLFlBQVksS0FBSyxpQkFBbkIsRUFBcEIsRUFDQyxJQURELENBQ00sb0JBQVk7QUFDaEIsWUFBTSxNQUFNLFNBQVMsSUFBVCxDQUFjLE9BQTFCO0FBQ0Esc0NBQThCLEdBQTlCO0FBQ0EsZUFBSyxhQUFMLEdBQXFCLENBQUMsR0FBRCxDQUFyQjtBQUNELE9BTEQsRUFLRyxpQkFBUztBQUNWLGdCQUFRLEdBQVIsQ0FBWSxLQUFaO0FBQ0EsZUFBSyxLQUFMLEdBQWEsbUJBQWI7QUFDQSxlQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDRCxPQVREO0FBVUQsS0F4Q007QUF5Q1AsaUNBQTZCLHFDQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCO0FBQ2pELFlBQU0sTUFBTixDQUFhLGVBQWIsQ0FBNkIsTUFBN0I7QUFDQSxlQUFTLFdBQVQsQ0FBcUIsTUFBckI7QUFDRCxLQTVDTTtBQTZDUCxpQkFBYSxxQkFBVSxLQUFWLEVBQWlCO0FBQzVCLGFBQU8sUUFBUCxDQUFnQixJQUFoQixnQkFBa0MsS0FBbEM7QUFDRCxLQS9DTTtBQWdEUCxvQkFBZ0Isd0JBQVUsR0FBVixFQUFlO0FBQzdCLFVBQUksSUFBSSxNQUFKLENBQVcsTUFBWCxHQUFvQixDQUF4QixFQUEyQjtBQUN6QixlQUFPLElBQUksTUFBWDtBQUNEO0FBQ0QsYUFBTyxJQUFJLE1BQUosQ0FBVyxLQUFYLENBQWlCLENBQWpCLEVBQW9CLENBQXBCLENBQVA7QUFDRDtBQXJETTtBQXBCTSxDQUFSLENBQVQ7O0FBNkVBLFNBQVMsNkJBQVQsQ0FBdUMsR0FBdkMsRUFBNEM7QUFDMUMsTUFBSSxpQkFBSiwwQ0FBNkQsSUFBSSxTQUFqRSxzQkFBMkYsSUFBSSxVQUEvRjtBQUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwidmFyIG5hdkFwcCA9IG5ldyBWdWUoe1xuICBlbDogJyNuYXYtYXBwJyxcbiAgZGF0YToge1xuICAgIGlzRXhwYW5kZWQ6IGZhbHNlXG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICB0b2dnbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuaXNFeHBhbmRlZCA9ICF0aGlzLmlzRXhwYW5kZWQ7XG4gICAgfVxuICB9XG59KVxudmFyIHZtID0gbmV3IFZ1ZSh7XG4gIGVsOiAnI2FwcCcsXG4gIGRhdGE6IHtcbiAgICBhcGlCYXNlVXJsOiBcImh0dHBzOi8vYXBpLnN3aWZ0cGFja2FnZS5kaXJlY3RvcnlcIixcbiAgICBzZWFyY2hRdWVyeTogXCJcIixcbiAgICBwb3B1bGFyUmVzdWx0czogbnVsbCxcbiAgICBzZWFyY2hSZXN1bHRzOiBudWxsLFxuICAgIGFkZFJlcG9zaXRvcnlOYW1lOiBcIlwiLFxuICAgIGVycm9yOiBudWxsXG4gIH0sXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgdXJpID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7IFxuICAgIGxldCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHVyaSk7XG4gICAgbGV0IHNlYXJjaFF1ZXJ5ID0gcGFyYW1zLmdldChcInF1ZXJ5XCIpO1xuICAgIGlmKHNlYXJjaFF1ZXJ5KSB7XG4gICAgICB0aGlzLnNlYXJjaFF1ZXJ5ID0gc2VhcmNoUXVlcnk7XG4gICAgICB0aGlzLnBlcmZvcm1TZWFyY2goKTtcbiAgICB9XG4gICAgdGhpcy5nZXRQb3B1bGFyKCk7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBnZXRQb3B1bGFyOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmFwaUJhc2VVcmx9L3BvcHVsYXJgO1xuICAgICAgdGhpcy4kaHR0cC5nZXQodXJsKS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgdGhpcy5wb3B1bGFyUmVzdWx0cyA9IHJlc3BvbnNlLmJvZHkucGFja2FnZXMubWFwKGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGFwcGVuZFBhY2thZ2VEZXBlbmRlbmN5U3RyaW5nKGVsZW1lbnQpO1xuICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5wb3B1bGFyUmVzdWx0cyk7XG4gICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgcGVyZm9ybVNlYXJjaDogXy5kZWJvdW5jZShmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0cyA9IFtdO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmFwaUJhc2VVcmx9L3NlYXJjaD9xdWVyeT0ke3RoaXMuc2VhcmNoUXVlcnl9YDtcbiAgICAgIHRoaXMuJGh0dHAuZ2V0KHVybCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0cyA9IHJlc3BvbnNlLmJvZHkucGFja2FnZXMubWFwKGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGFwcGVuZFBhY2thZ2VEZXBlbmRlbmN5U3RyaW5nKGVsZW1lbnQpO1xuICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9KTtcbiAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSwgMjAwKSxcbiAgICBhZGRQYWNrYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmFwaUJhc2VVcmx9L2FkZGA7XG4gICAgICB0aGlzLiRodHRwLnB1dCh1cmwsIHsgcmVwb3NpdG9yeTogdGhpcy5hZGRSZXBvc2l0b3J5TmFtZSB9KVxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICBjb25zdCBwa2cgPSByZXNwb25zZS5ib2R5LnBhY2thZ2VcbiAgICAgICAgYXBwZW5kUGFja2FnZURlcGVuZGVuY3lTdHJpbmcocGtnKVxuICAgICAgICB0aGlzLnNlYXJjaFJlc3VsdHMgPSBbcGtnXVxuICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBcIlBhY2thZ2Ugbm90IGZvdW5kXCI7XG4gICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0cyA9IFtdXG4gICAgICB9KVxuICAgIH0sXG4gICAgY29weVBhY2thZ2VEZXBlbmRlbmN5U3RyaW5nOiBmdW5jdGlvbiAocGtnLCBldmVudCkge1xuICAgICAgZXZlbnQudGFyZ2V0LnByZXZpb3VzU2libGluZy5zZWxlY3QoKTtcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gICAgfSxcbiAgICBzZWFyY2hUb3BpYzogZnVuY3Rpb24gKHRvcGljKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAvP3F1ZXJ5PSR7dG9waWN9YFxuICAgIH0sXG4gICAgZmlyc3RTaXhUb3BpY3M6IGZ1bmN0aW9uIChwa2cpIHtcbiAgICAgIGlmIChwa2cudG9waWNzLmxlbmd0aCA8IDYpIHtcbiAgICAgICAgcmV0dXJuIHBrZy50b3BpY3M7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGtnLnRvcGljcy5zbGljZSgwLCA2KTtcbiAgICB9XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBhcHBlbmRQYWNrYWdlRGVwZW5kZW5jeVN0cmluZyhwa2cpIHtcbiAgcGtnLmRlcGVuZGVuY3lfc3RyaW5nID0gYC5wYWNrYWdlKHVybDogXCJodHRwczovL2dpdGh1Yi5jb20vJHtwa2cuZnVsbF9uYW1lfS5naXRcIiwgZnJvbTogXCIke3BrZy5sYXRlc3RfdGFnfVwiKWA7XG59Il19

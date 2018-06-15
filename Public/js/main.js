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
  },
  mounted: function mounted() {
    console.log('view mounted');
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
        _this.searchResults = response.body.packages;
      }, function (error) {
        console.log(error);
      });
    },
    addPackage: function addPackage() {
      var _this2 = this;

      var url = this.apiBaseUrl + "/add";
      this.$http.put(url, { repository: this.addRepositoryName }).then(function (response) {
        _this2.searchResults = [response.body.package];
      }, function (error) {
        console.log(error);
        _this2.error = "Package not found";
        _this2.searchResults = [];
      });
    }
  }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJQdWJsaWNfc3JjL2pzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksS0FBSyxJQUFJLEdBQUosQ0FBUTtBQUNmLE1BQUksTUFEVztBQUVmLFFBQU07QUFDSixnQkFBWSxvQ0FEUjtBQUVKLGlCQUFhLEVBRlQ7QUFHSixtQkFBZSxJQUhYO0FBSUosdUJBQW1CLEVBSmY7QUFLSixXQUFPO0FBTEgsR0FGUztBQVNmLFdBQVMsbUJBQVk7QUFDbkIsWUFBUSxHQUFSLENBQVksdUJBQVosRUFBcUMsSUFBckM7QUFDRCxHQVhjO0FBWWYsV0FBUyxtQkFBWTtBQUNuQixZQUFRLEdBQVIsQ0FBWSxjQUFaO0FBQ0QsR0FkYztBQWVmLFdBQVM7QUFDUCxtQkFBZSx1QkFBVSxDQUFWLEVBQWE7QUFBQTs7QUFDMUIsVUFBSSxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsS0FBNEIsQ0FBaEMsRUFBbUM7QUFDakMsYUFBSyxhQUFMLEdBQXFCLEVBQXJCO0FBQ0E7QUFDRDtBQUNELFVBQU0sTUFBUyxLQUFLLFVBQWQsc0JBQXlDLEtBQUssV0FBcEQ7QUFDQSxXQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsR0FBZixFQUFvQixJQUFwQixDQUF5QixvQkFBWTtBQUNuQyxjQUFLLGFBQUwsR0FBcUIsU0FBUyxJQUFULENBQWMsUUFBbkM7QUFDRCxPQUZELEVBRUcsaUJBQVM7QUFDVixnQkFBUSxHQUFSLENBQVksS0FBWjtBQUNELE9BSkQ7QUFLRCxLQVpNO0FBYVAsZ0JBQVksc0JBQVk7QUFBQTs7QUFDdEIsVUFBTSxNQUFTLEtBQUssVUFBZCxTQUFOO0FBQ0EsV0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLEdBQWYsRUFBb0IsRUFBRSxZQUFZLEtBQUssaUJBQW5CLEVBQXBCLEVBQ0MsSUFERCxDQUNNLG9CQUFZO0FBQ2hCLGVBQUssYUFBTCxHQUFxQixDQUFDLFNBQVMsSUFBVCxDQUFjLE9BQWYsQ0FBckI7QUFDRCxPQUhELEVBR0csaUJBQVM7QUFDVixnQkFBUSxHQUFSLENBQVksS0FBWjtBQUNBLGVBQUssS0FBTCxHQUFhLG1CQUFiO0FBQ0EsZUFBSyxhQUFMLEdBQXFCLEVBQXJCO0FBQ0QsT0FQRDtBQVFEO0FBdkJNO0FBZk0sQ0FBUixDQUFUIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwidmFyIHZtID0gbmV3IFZ1ZSh7XG4gIGVsOiAnI2FwcCcsXG4gIGRhdGE6IHtcbiAgICBhcGlCYXNlVXJsOiBcImh0dHBzOi8vYXBpLnN3aWZ0cGFja2FnZS5kaXJlY3RvcnlcIixcbiAgICBzZWFyY2hRdWVyeTogXCJcIixcbiAgICBzZWFyY2hSZXN1bHRzOiBudWxsLFxuICAgIGFkZFJlcG9zaXRvcnlOYW1lOiBcIlwiLFxuICAgIGVycm9yOiBudWxsXG4gIH0sXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygnY3JlYXRlZCB2aWV3IGluc3RhbmNlJywgdGhpcyk7XG4gIH0sXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygndmlldyBtb3VudGVkJyk7XG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBwZXJmb3JtU2VhcmNoOiBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKHRoaXMuc2VhcmNoUXVlcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0cyA9IFtdO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB1cmwgPSBgJHt0aGlzLmFwaUJhc2VVcmx9L3NlYXJjaD9xdWVyeT0ke3RoaXMuc2VhcmNoUXVlcnl9YDtcbiAgICAgIHRoaXMuJGh0dHAuZ2V0KHVybCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIHRoaXMuc2VhcmNoUmVzdWx0cyA9IHJlc3BvbnNlLmJvZHkucGFja2FnZXM7XG4gICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgYWRkUGFja2FnZTogZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgdXJsID0gYCR7dGhpcy5hcGlCYXNlVXJsfS9hZGRgO1xuICAgICAgdGhpcy4kaHR0cC5wdXQodXJsLCB7IHJlcG9zaXRvcnk6IHRoaXMuYWRkUmVwb3NpdG9yeU5hbWUgfSlcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgdGhpcy5zZWFyY2hSZXN1bHRzID0gW3Jlc3BvbnNlLmJvZHkucGFja2FnZV1cbiAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICB0aGlzLmVycm9yID0gXCJQYWNrYWdlIG5vdCBmb3VuZFwiO1xuICAgICAgICB0aGlzLnNlYXJjaFJlc3VsdHMgPSBbXVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn0pOyJdfQ==

var navApp = new Vue({
  el: '#nav-app',
  data: {
    isExpanded: false
  },
  methods: {
    toggle: function () {
      this.isExpanded = !this.isExpanded;
    }
  }
})
var vm = new Vue({
  el: '#app',
  data: {
    apiBaseUrl: "https://api.swiftpackage.directory",
    searchQuery: "",
    popularResults: null,
    searchResults: null,
    addRepositoryName: "",
    error: null,
    previousSearchRequest: null
  },
  created: function () {
    let uri = window.location.search.substring(1); 
    let params = new URLSearchParams(uri);
    let searchQuery = params.get("query");
    if(searchQuery) {
      this.searchQuery = searchQuery;
      this.performSearch();
    }
    this.getPopular();
  },
  methods: {
    getPopular: function () {
      const url = `${this.apiBaseUrl}/popular`;
      this.$http.get(url).then(response => {
        this.popularResults = response.body.packages.map(element => {
          appendPackageDependencyString(element);
          return element;
        });
        console.log(this.popularResults);
      }, error => {
        console.log(error);
      });
    },
    performSearch: _.debounce(function (e) {
      if (this.searchQuery.length === 0) {
        this.searchResults = [];
        return;
      }
      const url = `${this.apiBaseUrl}/search?query=${this.searchQuery}`;
      this.$http.get(url, {
        before(request) {
          if (this.previousSearchRequest) {
            console.log('cancelling last request');
            this.previousSearchRequest.abort();
          }
          this.previousSearchRequest = request
        }
      }).then(response => {
        this.previousSearchRequest = null;
        this.searchResults = response.body.packages.map(element => {
          appendPackageDependencyString(element);
          return element;
        });
      }, error => {
        this.previousSearchRequest = null;
        console.log(error);
      })
    }, 200),
    addPackage: function () {
      const url = `${this.apiBaseUrl}/add`;
      this.$http.put(url, { repository: this.addRepositoryName })
      .then(response => {
        const pkg = response.body.package
        appendPackageDependencyString(pkg)
        this.searchResults = [pkg]
      }, error => {
        console.log(error);
        this.error = "Package not found";
        this.searchResults = []
      })
    },
    copyPackageDependencyString: function (pkg, event) {
      event.target.previousSibling.select();
      document.execCommand('copy');
    },
    searchTopic: function (topic) {
      window.location.href = `/?query=${topic}`
    },
    firstSixTopics: function (pkg) {
      if (pkg.topics.length < 6) {
        return pkg.topics;
      }
      return pkg.topics.slice(0, 6);
    }
  }
});

function appendPackageDependencyString(pkg) {
  pkg.dependency_string = `.package(url: "https://github.com/${pkg.full_name}.git", from: "${pkg.latest_tag}")`;
}
var vm = new Vue({
  el: '#app',
  data: {
    apiBaseUrl: "https://api.swiftpackage.directory",
    searchQuery: "",
    searchResults: null,
    addRepositoryName: "",
    error: null
  },
  created: function () {
    console.log('created view instance', this);
  },
  mounted: function () {
    console.log('view mounted');
  },
  methods: {
    performSearch: function (e) {
      if (this.searchQuery.length === 0) {
        this.searchResults = [];
        return;
      }
      const url = `${this.apiBaseUrl}/search?query=${this.searchQuery}`;
      this.$http.get(url).then(response => {
        this.searchResults = response.body.packages;
      }, error => {
        console.log(error);
      });
    },
    addPackage: function () {
      const url = `${this.apiBaseUrl}/add`;
      this.$http.put(url, { repository: this.addRepositoryName })
      .then(response => {
        this.searchResults = [response.body.package]
      }, error => {
        console.log(error);
        this.error = "Package not found";
        this.searchResults = []
      })
    }
  }
});
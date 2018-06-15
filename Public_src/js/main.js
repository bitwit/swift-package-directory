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
    this.searchQuery = "s";
    this.performSearch();
  },
  methods: {
    performSearch: function (e) {
      if (this.searchQuery.length === 0) {
        this.searchResults = [];
        return;
      }
      const url = `${this.apiBaseUrl}/search?query=${this.searchQuery}`;
      this.$http.get(url).then(response => {
        const pkgs = response.body.packages;
        pkgs.forEach(element => {
          appendPackageDependencyString(element);
        });
        this.searchResults = pkgs;
      }, error => {
        console.log(error);
      });
    },
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
      event.target.nextSibling.select();
      document.execCommand('copy');
    }
  }
});

function appendPackageDependencyString(pkg) {
  pkg.dependency_string = `.package(url: "https://github.com/${pkg.full_name}.git", from: "${pkg.latest_tag}")`;
}
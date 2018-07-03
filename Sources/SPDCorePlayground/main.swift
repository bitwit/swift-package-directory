import Foundation
import SPDCore
import PromiseKit

guard let urlString = ProcessInfo.processInfo.environment["cloudantUrl"] else {
    fatalError("no cloudantUrl provided")
}
guard let githubUsername = ProcessInfo.processInfo.environment["githubUsername"] else {
    fatalError("no githubUsername provided")
}
guard let githubAccessToken = ProcessInfo.processInfo.environment["githubAccessToken"] else {
    fatalError("no githubAccessToken provided")
}
guard let popularIndex = ProcessInfo.processInfo.environment["popularIndex"] else {
    fatalError("no popularIndex")
}
guard let searchIndex = ProcessInfo.processInfo.environment["searchIndex"] else {
    fatalError("no searchIndex")
}

func main () {
    
    let startTime = Date()
    print("starting SPDCore playground")
    let cloudant = Cloudant(baseUrl: urlString)
    cloudant.databaseName = "test-bed"
    let github = GitHub(username: githubUsername, accessToken: githubAccessToken)
    let packageManager = PackageManager(cloudant: cloudant, github: github)
    let packageCrawler = PackageCrawler(packageManager: packageManager)
    
//    var query = SearchQuery()
//    query.keyword = "sl"
//    cloudant.search(query: query)
    
    packageCrawler.execute()
//    packageManager.searchAndAddNewPackages()
        .done { (pkgs) in
            print("total", pkgs.count)
            print(pkgs.map { $0.full_name! }.joined(separator: "\n"))
            Networking.reportCallCount()
            print("task completed in \(-startTime.timeIntervalSinceNow)s")
            exit(0)
        }.catch { (err) in
            print(err)
            print("task worked for \(-startTime.timeIntervalSinceNow)s before error")
            exit(1)
    }
    
    RunLoop.main.run()
}

main()

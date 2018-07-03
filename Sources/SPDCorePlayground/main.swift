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

struct AnyOutput<R: Codable>: WhiskOutput {

    typealias ResultType = R
    
    let success = true
    
    init(result: R)  {
        print(result)
    }
}

func main () {
    
    let startTime = Date()
    print("starting SPDCore playground")
    let cloudant = Cloudant(baseUrl: urlString)
    cloudant.databaseName = "test-bed"
    let github = GitHub(username: githubUsername, accessToken: githubAccessToken)
    let packageManager = PackageManager(cloudant: cloudant, github: github)
    let packageCrawler = PackageCrawler(packageManager: packageManager)
//
//    github.getRateLimit()
//        .done { limits in
//            print(limits)
//            print(limits.rate.reset)
//            exit(0)
//    }
//    RunLoop.main.run()
    
//    var query = SearchQuery()
//    query.keyword = "d"
//    let task = cloudant.search(query: query)
    
    let task = packageCrawler.execute()
    whiskWrap(task, outputType: AnyOutput<[Package]>.self) { o, e in
        print(o, e)
    }
}

main()

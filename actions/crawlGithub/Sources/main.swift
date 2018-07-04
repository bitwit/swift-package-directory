import Foundation
import PromiseKit
import SPDCore

struct Input: Codable {
    let cloudantUrl: String
    let githubUsername: String
    let githubAccessToken: String
}

struct Output: WhiskOutput {
    
    typealias ResultType = [Package]
    
    let success: Bool = true
    
    init(result: ResultType) {

    }
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {

    let cloudant = Cloudant(baseUrl: param.cloudantUrl)
    cloudant.databaseName = "test-bed"
    let github = GitHub(username: param.githubUsername, accessToken: param.githubAccessToken)
    let packageManager = PackageManager(cloudant: cloudant, github: github)
    let packageCrawler = PackageCrawler(packageManager: packageManager)
    
    let task = packageCrawler.execute()
    whiskWrap(task, outputType: Output.self, completion: completion)
}

#if os(macOS)
guard let urlString = ProcessInfo().environment["cloudantUrl"] else {
    fatalError("no cloudantUrl provided")
}
guard let githubUsername = ProcessInfo().environment["githubUsername"] else {
    fatalError("no githubUsername provided")
}
guard let githubAccessToken = ProcessInfo().environment["githubAccessToken"] else {
    fatalError("no githubAccessToken provided")
}
main(param: Input(cloudantUrl: urlString, githubUsername: githubUsername, githubAccessToken: githubAccessToken)) { output, error in
    print(output, error)
}
#endif


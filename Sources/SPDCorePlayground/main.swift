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
    
    print("starting SPDCore playground")
    let cloudant = Cloudant(baseUrl: urlString)
    let github = GitHub(username: githubUsername, accessToken: githubAccessToken)
    let packageManager = PackageManager(cloudant: cloudant, github: github)
//    _ = cloudant.getMostPopular(popularIndex: popularIndex)
//        .done({ packages in
//            print(packages.map { $0.full_name! + " - \($0.stargazers_count!)\n" } .joined())
//        })
//        .catch { err in
//            print(err)
//            exit(1)
//        }
//        .finally {
//            exit(0)
//    }
    
//    let repo = "reactivex/rxswift"
//    let _ = cloudant.find(repository: repo)
//        .then { pkg in
//            return packageManager.createOrUpdatePackage(repositoryName: repo, existingPackage: pkg)
//        }
//    let _ = cloudant.findAll()
//        .then { (packages) in
//            return packageManager.updatePackagesInChunks(packages: packages)
//        }
    var query = SearchQuery()
    query.selector = ["$text": "s"]
    query.use_index = searchIndex

    let _ = cloudant.search(query: query)
        .done({ result in
//            print(try! JSONSerialization.jsonObject(with: try! JSONEncoder().encode(result), options: []))
            print(result.flatMap { $0.full_name }.joined(separator: "\n") )
            print("total", result.count)
        })
        .catch { err in
            print(err)
            exit(1)
        }
        .finally {
            exit(0)
        }
    RunLoop.main.run()
}

main()

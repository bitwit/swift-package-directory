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
    fatalError("no searchIndex")
}

func main () {
    let cloudant = Cloudant(baseUrl: urlString)
    let github = GitHub(username: githubUsername, accessToken: githubAccessToken)
    let packageManager = PackageManager(cloudant: cloudant, github: github)
    _ = cloudant.getMostPopular(popularIndex: popularIndex)
        .done({ packages in
            print(packages.map { $0.full_name! + " - \($0.stargazers_count!)\n" } .joined())
        })
        .catch { err in
            print(err)
            exit(1)
        }
        .finally {
            exit(0)
    }

    
//    let _ = cloudant.find(repository: "onevcat/Rainbow")
//        .then { (document) in
//            return packageManager.createOrUpdatePackage(repositoryName: "onevcat/Rainbow", existingPackage: document)
//        }
//        .done({ package in
//            print(try! JSONSerialization.jsonObject(with: try! JSONEncoder().encode(package), options: []))
//        })
//        .catch { err in
//            print(err)
//            exit(1)
//        }
//        .finally {
//            exit(0)
//        }
    RunLoop.main.run()
}

main()

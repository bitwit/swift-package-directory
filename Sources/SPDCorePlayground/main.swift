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

func main () {
    let cloudant = Cloudant(baseUrl: urlString)
    let github = GitHub(username: githubUsername, accessToken: githubAccessToken)
    let packageManager = PackageManager(cloudant: cloudant, github: github)
    
    _ = cloudant.findAll()
        .then(packageManager.updatePackagesInChunks(packages:))
        .done({ packages in
            print(packages.count, "packages updated")
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

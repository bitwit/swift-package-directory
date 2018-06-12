import Foundation
import SPDCore
import PromiseKit

guard let urlString = ProcessInfo().environment["cloudantUrl"] else {
    fatalError("no cloudantUrl provided")
}
guard let githubUsername = ProcessInfo().environment["githubUsername"] else {
    fatalError("no githubUsername provided")
}
guard let githubAccessToken = ProcessInfo().environment["githubAccessToken"] else {
    fatalError("no githubAccessToken provided")
}

func main () {
    let cloudant = Cloudant(baseUrl: urlString)
    let github = GitHub(username: githubUsername, accessToken: githubAccessToken)
    let packageManager = PackageManager(cloudant: cloudant, github: github)
    
    let _ = cloudant.find(repository: "reactivex/rxswift")
        .then { (document) in
            return packageManager.createOrUpdatePackage(repositoryName: "reactivex/rxswift", existingPackage: document)
        }
        .done({ package in
            print(package)
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

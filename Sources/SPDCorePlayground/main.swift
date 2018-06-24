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
    
    packageManager.searchAndAddNewPackages()
        .done { (pkgs) in
            print("total added", pkgs.count)
            print(pkgs.map { $0.full_name! }.joined(separator: "\n"))
        }.catch { (err) in
            print(err)
    }
    
    RunLoop.main.run()
}

main()

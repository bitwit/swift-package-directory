import Foundation
import PromiseKit
import SPDCore

struct Input: Codable {
    let cloudantUrl: String
    let githubAccessToken: String
    let githubUsername: String
}

struct Output: Codable {
    let package: Package?
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    
    let cloudant = Cloudant(baseUrl: param.cloudantUrl)
    let github = GitHub(username: param.githubUsername, accessToken: param.githubAccessToken)
    let packageManager = PackageManager(cloudant: cloudant, github: github)
    
     _ = cloudant.findAll()
        .then(packageManager.updatePackagesInChunks(packages:))
        .done({ packages in
            print(packages.count, "packages updated")
            completion(Output(package: packages.first), nil)
        })
        .catch { err in
            completion(nil, err)
    }
        .finally {
            exit(0)
    }

    RunLoop.main.run()
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
main(param: Input(cloudantUrl: urlString, githubAccessToken: githubAccessToken, githubUsername: githubUsername)) { output, error in
    print(output, error)
    exit(error == nil ? 0 : 1)
}
#endif


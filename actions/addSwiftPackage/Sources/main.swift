import Foundation
import PromiseKit
import SPDCore

struct Input: Codable {
    let cloudantUrl: String
    let repository: String
}

struct Output: Codable {
    let package: Package?
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    
    let cloudant = Cloudant(baseUrl: param.cloudantUrl)
    let github = GitHub()
    let packageManager = PackageManager(cloudant: cloudant, github: github)
    
    cloudant.find(repository: param.repository)
        .then { (document) in
            return packageManager.createOrUpdatePackage(repositoryName: param.repository, existingPackage: document)
        }
        .done({ package in
            print(package)
            completion(Output(package: package), nil)
        })
        .catch { err in
            completion(nil, err)
            exit(1)
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
main(param: Input(cloudantUrl: urlString, repository: "bitwit/slurp")) { output, error in
    print(output, error)
    exit(error == nil ? 0 : 1)
}
#endif


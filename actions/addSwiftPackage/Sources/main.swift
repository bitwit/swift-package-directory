import Foundation
import PromiseKit
import SPDCore

struct Input: Codable {
    let cloudantUrl: String
    let repository: String
    let searchIndex: String?
}

struct Output: Codable {
    let package: Package?
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    
    let cloudant = Cloudant(baseUrl: param.cloudantUrl)
    let github = GitHub()
    let packageManager = PackageManager(cloudant: cloudant, github: github)
    
//     _ = cloudant.findAll()
//        .then(packageManager.updatePackagesInChunks(packages:))
//        .done({ packages in
//            print(packages.count, "packages updated")
//            completion(Output(package: packages.first), nil)
//        })
//        .catch { err in
//            completion(nil, err)
//    }

//      _ = cloudant.search(term: "s", searchIndex: param.searchIndex!)
//         .done({ packages in
//            print(packages)
//            print(packages.count, "packages found")
//             completion(Output(package: packages.first), nil)
//         })
//         .catch { err in
//             completion(nil, err)
//        }
//
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
    }
    RunLoop.main.run()
}

#if os(macOS)
guard let urlString = ProcessInfo().environment["cloudantUrl"] else {
    fatalError("no cloudantUrl provided")
}
guard let searchIndex = ProcessInfo().environment["searchIndex"] else {
    fatalError("no searchIndex provided")
}
main(param: Input(cloudantUrl: urlString, repository: "pixyzehn/PackageBuilder", searchIndex: searchIndex)) { output, error in
    print(output, error)
    exit(error == nil ? 0 : 1)
}
#endif


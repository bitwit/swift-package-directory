import Foundation
import PromiseKit
import SPDCore

struct Input: Codable {
    let cloudantUrl: String
}

struct Output: Codable {
    let package: Package?
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    
    let cloudant = Cloudant(baseUrl: param.cloudantUrl)
    let github = GitHub()
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
main(param: Input(cloudantUrl: urlString)) { output, error in
    print(output, error)
    exit(error == nil ? 0 : 1)
}
#endif


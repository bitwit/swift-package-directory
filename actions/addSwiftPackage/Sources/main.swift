import Foundation

struct Input: Codable {
    let repository: String
    let cloudantUrl: String
}

struct Output: Codable {
    let package: Package?
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    
//    findAllInDB(cloudantUrl: param.cloudantUrl) { packages, error  -> Void in
//
//        packages?.forEach({ (package) in
//            guard let repoName = package.full_name else { return }
//            createOrUpdatePackage(cloudantUrl: param.cloudantUrl, repositoryName: repoName, existingPackage: package) { (package, error) in
////                completion(Output(package: package), error)
//            }
//        })
//    }
    
    findInDB(cloudantUrl: param.cloudantUrl, repository: param.repository) { (document, error) in
        createOrUpdatePackage(cloudantUrl: param.cloudantUrl, repositoryName: param.repository, existingPackage: document) { (package, error) in
            completion(Output(package: package), error)
        }
    }

    RunLoop.main.run()
}

#if os(macOS)
guard let urlString = ProcessInfo().environment["cloudantUrl"] else {
    fatalError("no cloudantUrl provided")
}
main(param: Input(repository: "pixyzehn/PackageBuilder", cloudantUrl: urlString)) { output, error in
    print(output, error)
}
#endif


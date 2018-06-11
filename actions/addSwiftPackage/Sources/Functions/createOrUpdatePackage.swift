import Foundation

func createOrUpdatePackage(cloudantUrl: String, repositoryName: String, existingPackage: Package?, completion: @escaping (Package?, Error?) -> ()) {
    
    getRepoInfo(name: repositoryName) { (package, error) in
        
        guard var pkg = package else {
            fatalError("no package")
        }
        
        if let doc = existingPackage {
            print("Doc already exists; updating")
            pkg.applyIdentification(from: doc)
        }
        
        writeToDB(cloudantUrl: cloudantUrl, package: pkg) { (error) in
            completion(pkg, error)
        }
    }
}

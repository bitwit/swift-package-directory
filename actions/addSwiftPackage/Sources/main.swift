import Foundation

struct Input: Codable {
    let repository: String
    let cloudantUrl: String
}

struct Output: Codable {
    let package: Package
}

enum SPDError: Error {
    case fatal(String)
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    
    findInDB(cloudantUrl: param.cloudantUrl, repository: param.repository) { (document, error) in
        
        getRepoInfo(name: param.repository) { (package, error) in
            
            guard var pkg = package else {
                fatalError("no package")
            }
            
            if let doc = document {
                print("Doc already exists; updating")
                pkg.apply(document: doc)
            }
            
            writeToDB(cloudantUrl: param.cloudantUrl, package: pkg) { (error) in
                completion(Output(package: pkg), error)
            }
        }
    }


    RunLoop.main.run()
}

#if os(macOS)
guard let urlString = ProcessInfo().environment["cloudantUrl"] else {
    fatalError("no cloudantUrl provided")
}
main(param: Input(repository: "JohnSundell/ShellOut", cloudantUrl: urlString)) { output, error in
    print(output, error)
}
#endif


import Foundation
import PromiseKit

public class GitHub {
    
    public init () {
        
    }
    
    public func getRepoInfo(name: String) -> Promise<Package> {
        
        let repoUrlString = "https://api.github.com/repos/\(name)"
        
        guard let url = URL(string: repoUrlString) else {
            return Promise(error: SPDError.fatal("invalid url"))
        }
        
        let req = URLRequest(url: url)
        return perform(request: req, transformingResponseTo: Package.self)
            .map({ (package) -> Package in
                guard package.full_name != nil && package.html_url != nil else {
                    throw SPDError.fatal("Package does not exist")
                }
                return package
            })
    }

}

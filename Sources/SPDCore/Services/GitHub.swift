import Foundation
import PromiseKit

public struct GitTag: Codable {
    let name: String
}
public struct GitTopics: Codable {
    let names: [String]
}

public class GitHub {
    
    public let username: String
    public let accessToken: String
    
    public init(username: String, accessToken: String) {
        self.username = username
        self.accessToken = accessToken
    }
    
    public func getRepoInfo(name: String) -> Promise<Package> {
        
        let repoUrlString = "https://api.github.com/repos/\(name)"
        
        guard let url = URL(string: repoUrlString) else {
            return Promise(error: SPDError.fatal("invalid url"))
        }
        
        var req = URLRequest(url: url)
        
        let userPasswordString = "\(username):\(accessToken)"
        let userPasswordData = userPasswordString.data(using: .utf8)
        let base64EncodedCredential = userPasswordData!.base64EncodedString()
        req.addValue("Basic \(base64EncodedCredential)", forHTTPHeaderField: "Authorization")

        return perform(request: req, transformingResponseTo: Package.self)
            .map({ (package) -> Package in
                guard package.full_name != nil && package.html_url != nil else {
                    throw SPDError.fatal("Package does not exist")
                }
                return package
            })
    }
    
    public func getRepoTags(name: String) -> Promise<[GitTag]> {
        
        let repoUrlString = "https://api.github.com/repos/\(name)/tags"
        
        guard let url = URL(string: repoUrlString) else {
            return Promise(error: SPDError.fatal("invalid url"))
        }
        
        var req = URLRequest(url: url)
        let userPasswordString = "\(username):\(accessToken)"
        let userPasswordData = userPasswordString.data(using: .utf8)
        let base64EncodedCredential = userPasswordData!.base64EncodedString()
        req.addValue("Basic \(base64EncodedCredential)", forHTTPHeaderField: "Authorization")
        
        return perform(request: req, transformingResponseTo: [GitTag].self)
            .map({ (tags) -> [GitTag] in
                if tags.isEmpty {
                    print("[WARNING]: Package \(name) has no tagged versions")
                }
                return tags
            })
    }
    
    // This is experimental API, so in case of any problems we'll recover with an empty array
    // and guarantee success no matter what goes wrong
    public func getRepoTopics(name: String) -> Guarantee<[String]> {

        let repoUrlString = "https://api.github.com/repos/\(name)/topics"
        guard let url = URL(string: repoUrlString) else {
            return Guarantee { $0([]) }
        }
        
        var req = URLRequest(url: url)
        let userPasswordString = "\(username):\(accessToken)"
        let userPasswordData = userPasswordString.data(using: .utf8)
        let base64EncodedCredential = userPasswordData!.base64EncodedString()
        req.addValue("application/vnd.github.mercy-preview+json", forHTTPHeaderField: "Accept")
        req.addValue("Basic \(base64EncodedCredential)", forHTTPHeaderField: "Authorization")
        
        return perform(request: req, transformingResponseTo: GitTopics.self)
            .map { $0.names }
            .recover({ (err) -> Guarantee<[String]> in
                return Guarantee { $0([]) }
            })
    }
}

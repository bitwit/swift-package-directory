import Foundation
import PromiseKit

public struct GitTag: Codable {
    let name: String
}
public struct GitTopics: Codable {
    let names: [String]
}
public struct GitSearchResults: Codable {
    let items: [Package]
    let total_count: Int
}
public struct GitRepoContents: Codable {
    let tree: [GitFile]
}
public struct GitFile: Codable {
    let path: String
    let url: String?
}

public struct RateLimit: Codable {
    public var limit: Int
    public var remaining: Int
    public var reset: Int
}

public struct GitHubRateLimitResponse: Codable {
    public var resources: [String: RateLimit]
    public var rate: RateLimit
}

public class GitHub {
    
    public let username: String
    public let accessToken: String
    
    public init(username: String, accessToken: String) {
        self.username = username
        self.accessToken = accessToken
    }
    
    public func getRateLimit() -> Promise<GitHubRateLimitResponse> {
        let urlString = "https://api.github.com/rate_limit"
        
        guard let url = URL(string: urlString) else {
            return Promise(error: SPDError.fatal("invalid url"))
        }
        
        var req = URLRequest(url: url)
        
        let userPasswordString = "\(username):\(accessToken)"
        let userPasswordData = userPasswordString.data(using: .utf8)
        let base64EncodedCredential = userPasswordData!.base64EncodedString()
        req.addValue("Basic \(base64EncodedCredential)", forHTTPHeaderField: "Authorization")
        
        return Networking.perform(req, transformingResponseTo: GitHubRateLimitResponse.self)
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

        return Networking.perform(req, transformingResponseTo: Package.self)
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
        
        return Networking.perform(req, transformingResponseTo: [GitTag].self)
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
        
        return Networking.perform(req, transformingResponseTo: GitTopics.self)
            .map { $0.names }
            .recover({ (err) -> Guarantee<[String]> in
                return Guarantee { $0([]) }
            })
    }
    
    public func searchForSwiftPackages(inDateCreationRange range: (Date, Date), page: Int = 1, limit: Int = 100) -> Promise<GitSearchResults> {
        
        let formatter = ISO8601DateFormatter()
        let startDate = formatter.string(from: range.0)
        let endDate = formatter.string(from: range.1)
        
        let repoUrlString = "https://api.github.com/search/repositories?"
        let cleanString = repoUrlString + "q=language:swift+stars:>0+created:\(startDate)..\(endDate)&page=\(page)&per_page=\(limit)".addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
        
        guard let url = URL(string: cleanString) else {
            return Promise(error: SPDError.fatal("invalid url \(repoUrlString)"))
        }
        
        var req = URLRequest(url: url)
        let userPasswordString = "\(username):\(accessToken)"
        let userPasswordData = userPasswordString.data(using: .utf8)
        let base64EncodedCredential = userPasswordData!.base64EncodedString()
        req.addValue("Basic \(base64EncodedCredential)", forHTTPHeaderField: "Authorization")
        
        return Networking.perform(req, transformingResponseTo: GitSearchResults.self)
    }
    
    public func getRepoRootContents(name: String) -> Promise<GitRepoContents> {
        let contentsUrl = "https://api.github.com/repos/\(name)/git/trees/master"
        
        guard let url = URL(string: contentsUrl) else {
            return Promise(error: SPDError.fatal("invalid url \(contentsUrl)"))
        }
        
        var req = URLRequest(url: url)
        let userPasswordString = "\(username):\(accessToken)"
        let userPasswordData = userPasswordString.data(using: .utf8)
        let base64EncodedCredential = userPasswordData!.base64EncodedString()
        req.addValue("Basic \(base64EncodedCredential)", forHTTPHeaderField: "Authorization")
        
        return Networking.perform(req, transformingResponseTo: GitRepoContents.self)
            .recover({ _ -> Guarantee<GitRepoContents> in
                return Guarantee { $0( GitRepoContents(tree: []) ) }
            })
    }
}

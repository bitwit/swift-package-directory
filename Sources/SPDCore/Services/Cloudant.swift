import Foundation
import PromiseKit

public struct FindAllResult: Codable {
    let total_rows: Int
    let rows: [DocumentContainer]
}

struct PopularSearch: Codable {
    let limit: Int = 10
    let sort = [["stargazers_count": "desc"]]
    let selector = ["stargazers_count": ["$gte": 100]]
    let use_index: String
}

public struct FindResult: Codable {
    let docs: [Package]
}

public struct WrittenDocumentResult: Codable {
    let id: String
    let rev: String
    let ok: Bool
}

public class Cloudant {
    
    public let baseUrl: String
    
    public init(baseUrl: String) {
        self.baseUrl = baseUrl
    }
    
    public func getMostPopular(popularIndex: String) -> Promise<[Package]> {
        
        guard let url = URL(string: baseUrl + "/swift-packages-directory/_find") else {
            return Promise(error:  SPDError.fatal("invalid url"))
        }
        
        let query = PopularSearch(use_index: popularIndex)
        
        var req = URLRequest(url: url)
        let reqData = try! JSONEncoder().encode(query)
        req.addValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = reqData
        req.httpMethod = "POST"
        
        return perform(request: req, transformingResponseTo: FindResult.self)
            .map({ (results) -> [Package] in
                return results.docs
            })
    }
    
    public func search(query: SearchQuery) -> Promise<[Package]> {
        
        let urlString = URL(string: baseUrl + "/swift-packages-directory/_design/keywordSearch/_search/keywordSearch?limit=\(query.limit)&q=keywords:\(query.keyword)&sort=%22-stargazers_count%22&include_docs=true")
        
        guard let url = urlString else {
            return Promise(error:  SPDError.fatal("invalid url"))
        }
        
        let req = URLRequest(url: url)
        
        return perform(request: req, transformingResponseTo: FindAllResult.self, debug: false)
            .map({ (results) -> [Package] in
                return results.rows.compactMap { $0.doc }
            })
    }
    
    public func find(repository: String) -> Promise<Package?> {
        
        guard let url = URL(string: baseUrl + "/swift-packages-directory/_find") else {
            return Promise(error: SPDError.fatal("invalid url"))
        }
        
        let query: [String: [String: String]] = [
            "selector": [
                "html_url": "https://github.com/" + repository.lowercased()
            ]
        ]
        
        var req = URLRequest(url: url)
        let reqData = try! JSONSerialization.data(withJSONObject: query, options: [])
        req.addValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = reqData
        req.httpMethod = "POST"
        
        return perform(request: req, transformingResponseTo: FindResult.self)
            .map({ (results) -> Package? in
                return results.docs.first
            })
    }
    
    public func findAll() -> Promise<[Package]> {
        
        guard let url = URL(string: baseUrl + "/swift-packages-directory/_all_docs?include_docs=true") else {
            return Promise(error: SPDError.fatal("invalid url"))
        }
        
        let query: [String: [String]] = [
            "fields": [ "_id", "_rev", "full_name"]
        ]
        
        var req = URLRequest(url: url)
        let reqData = try! JSONSerialization.data(withJSONObject: query, options: [])
        req.addValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = reqData
        req.httpMethod = "POST"
        
        return perform(request: req, transformingResponseTo: FindAllResult.self)
            .map({ (results) -> [Package]  in
                return results.rows.compactMap({ $0.doc })
            })
    }
    
    public func writeToDB(package: Package) -> Promise<Package> {
        
        guard let url = URL(string: baseUrl + "/swift-packages-directory/\(package._id ?? "")") else {
            return Promise(error: SPDError.fatal("invalid url"))
        }
        
        var finalPackage = package
        finalPackage.buildKeywords()
        finalPackage.html_url = finalPackage.html_url?.lowercased()
        finalPackage.last_package_update = Date()
        
        var req = URLRequest(url: url)
        let reqData = try! JSONEncoder().encode(finalPackage)
        req.addValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = reqData
        req.httpMethod = (package._id?.isEmpty == false) ? "PUT" : "POST"
        
        return perform(request: req, transformingResponseTo: WrittenDocumentResult.self)
            .tap({ (result) in
                if case let .rejected(e) = result {
                   print(package.full_name, package._rev, e)
                }
            })
            .map({ _ -> Package in
                return finalPackage
            })
    }

}

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
    public var databaseName: String = "swift-packages-directory"
    
    public init(baseUrl: String) {
        self.baseUrl = baseUrl
    }
    
    public func getMostPopular(popularIndex: String) -> Promise<[Package]> {
        
        guard let url = URL(string: baseUrl + "/\(databaseName)/_find") else {
            return Promise(error:  SPDError.fatal("invalid url"))
        }
        
        let query = PopularSearch(use_index: popularIndex)
        
        var req = URLRequest(url: url)
        let reqData = try! JSONEncoder().encode(query)
        req.addValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = reqData
        req.httpMethod = "POST"
        
        return Networking.perform(req, transformingResponseTo: FindResult.self)
            .map({ (results) -> [Package] in
                return results.docs
            })
    }
    
    public func search(query: SearchQuery) -> Promise<[Package]> {
        
        let urlString = baseUrl
            + "/\(databaseName)/_design/keywordSearch/_search/keywordSearch?limit=\(query.limit)&q=keywords:"
            + "\(query.keyword)&sort=\"-stargazers_count\"&include_docs=true"
                .addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
        
        guard let url = URL(string: urlString) else {
            return Promise(error:  SPDError.fatal("invalid url"))
        }
        
        let req = URLRequest(url: url)
        
        return Networking.perform(req, transformingResponseTo: FindAllResult.self, debug: false)
            .map({ (results) -> [Package] in
                return results.rows.compactMap { $0.doc }
            })
    }
    
    public func find(repository: String) -> Promise<Package?> {
        
        guard let url = URL(string: baseUrl + "/\(databaseName)/_find") else {
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
        
        return Networking.perform(req, transformingResponseTo: FindResult.self)
            .map({ (results) -> Package? in
                return results.docs.first
            })
    }
    
    public func findAll() -> Promise<[Package]> {
        
        guard let url = URL(string: baseUrl + "/\(databaseName)/_all_docs?include_docs=true") else {
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
        
        return Networking.perform(req, transformingResponseTo: FindAllResult.self)
            .map({ (results) -> [Package]  in
                return results.rows.compactMap({ $0.doc })
            })
    }
    
    public func writeToDB(package: Package) -> Promise<Package> {
        
        guard let url = URL(string: baseUrl + "/\(databaseName)/\(package._id ?? "")") else {
            return Promise(error: SPDError.fatal("invalid url"))
        }
        
        var finalPackage = package
        finalPackage.buildKeywords()
        finalPackage.html_url = finalPackage.html_url?.lowercased()
//        finalPackage.last_package_update = Date()
        
        var req = URLRequest(url: url)
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        let reqData = try! encoder.encode(finalPackage)
        req.addValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = reqData
        req.httpMethod = (package._id?.isEmpty == false) ? "PUT" : "POST"
        
        return Networking.perform(req, transformingResponseTo: WrittenDocumentResult.self)
            .map({ _ -> Package in
                return finalPackage
            })
    }
    
    public func getAppConfig() -> Promise<AppConfig> {
        
        guard let url = URL(string: baseUrl + "/\(databaseName)/config") else {
            return Promise(error: SPDError.fatal("invalid url"))
        }
        
        let req = URLRequest(url: url)
        return Networking.perform(req, transformingResponseTo: AppConfig.self)
    }
    
    public func setAppConfig(_ config: AppConfig) -> Promise<WrittenDocumentResult> {
        
        guard let url = URL(string: baseUrl + "/\(databaseName)/config") else {
            return Promise(error: SPDError.fatal("invalid url"))
        }
        
        var req = URLRequest(url: url)
        
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        let reqData = try! encoder.encode(config)
        
        req.addValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = reqData
        req.httpMethod = "PUT"
        
        return Networking.perform(req, transformingResponseTo: WrittenDocumentResult.self)
    }

}

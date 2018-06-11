import Foundation
import PromiseKit

public struct FindAllResult: Codable {
    let total_rows: Int
    let rows: [DocumentContainer]
}

struct FindQuery: Codable {
    let selector: [String: String]
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
    
    public func search(term: String, searchIndex: String) -> Promise<[Package]> {
        
        guard false == term.isEmpty else {
            return Promise(error: SPDError.fatal("query string must not be empty"))
        }
    
        guard let url = URL(string: baseUrl + "/swift-packages-directory/_find") else {
            return Promise(error:  SPDError.fatal("invalid url"))
        }
    
        let query = FindQuery(
            selector: ["$text": term],
            use_index: searchIndex
        )
    
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
        
        var req = URLRequest(url: url)
        let reqData = try! JSONEncoder().encode(finalPackage)
        req.addValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = reqData
        req.httpMethod = (package._id?.isEmpty == false) ? "PUT" : "POST"
        
        return perform(request: req, transformingResponseTo: WrittenDocumentResult.self)
            .map({ _ -> Package in
                return finalPackage
            })
    }

}

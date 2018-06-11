import Foundation

struct Document: Codable {
    let _id: String
    let _rev: String
}

struct SearchResults: Codable {
    let docs: [Document]
}

func findInDB(cloudantUrl: String, repository: String, completion: @escaping (Document?, Error?) -> ()) {
    
    guard let url = URL(string: cloudantUrl + "/swift-packages-directory/_find") else {
        completion(nil, SPDError.fatal("invalid url"))
        exit(0)
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
    
    let task = URLSession.shared.dataTask(with: req) { (data, response, error) in
        
        if error != nil {
            completion(nil, SPDError.fatal("database response error"))
            exit(0)
        }
        
        guard let json = data else {
            completion(nil, SPDError.fatal("database response nil"))
            exit(0)
        }
        
//        print(try! JSONSerialization.jsonObject(with: json, options: []))
        
        guard let results = try? JSONDecoder().decode(SearchResults.self, from: json) else {
            completion(nil, SPDError.fatal("failed to decode to expected JSON response"))
            exit(0)
        }
        
        completion(results.docs.first, error)
    }
    task.resume()
}

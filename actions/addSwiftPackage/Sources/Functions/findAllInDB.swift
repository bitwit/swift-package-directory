import Foundation

struct FindAllResults: Codable {
    let total_rows: Int
    let rows: [DocumentContainer]
}

func findAllInDB(cloudantUrl: String, completion: @escaping ([Package]?, Error?) -> ()) {
    
    guard let url = URL(string: cloudantUrl + "/swift-packages-directory/_all_docs?include_docs=true") else {
        completion(nil, SPDError.fatal("invalid url"))
        exit(1)
    }
    
    let query: [String: [String]] = [
        "fields": [ "_id", "_rev", "full_name"]
    ]
    
    var req = URLRequest(url: url)
    let reqData = try! JSONSerialization.data(withJSONObject: query, options: [])
    req.addValue("application/json", forHTTPHeaderField: "Content-Type")
    req.httpBody = reqData
    req.httpMethod = "POST"
    
    let task = URLSession.shared.dataTask(with: req) { (data, response, error) in
        
        if error != nil {
            completion(nil, SPDError.fatal("database response error"))
            exit(1)
        }
        
        guard let json = data else {
            completion(nil, SPDError.fatal("database response nil"))
            exit(1)
        }
        
        print(try! JSONSerialization.jsonObject(with: json, options: []))
        
        guard let results = try? JSONDecoder().decode(FindAllResults.self, from: json) else {
            completion(nil, SPDError.fatal("failed to decode to expected JSON response"))
            exit(1)
        }
        
        completion(results.rows.compactMap({ $0.doc }), error)
    }
    task.resume()
}

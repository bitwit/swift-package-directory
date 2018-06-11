import Foundation

struct WrittenDocumentResult: Codable {
    let id: String
    let rev: String
    let ok: Bool
}

func writeToDB(cloudantUrl: String, package: Package, completion: @escaping (Error?) -> ()) {
    
    guard let url = URL(string: cloudantUrl + "/swift-packages-directory/\(package._id ?? "")") else {
        completion(SPDError.fatal("invalid url"))
        exit(0)
    }
    
    var finalPackage = package
    finalPackage.buildKeywords()
    finalPackage.html_url = finalPackage.html_url.lowercased()
    
    print("keywords:", finalPackage.keywords)

    var req = URLRequest(url: url)
    let reqData = try! JSONEncoder().encode(finalPackage)
    req.addValue("application/json", forHTTPHeaderField: "Content-Type")
    req.httpBody = reqData
    req.httpMethod = (package._id?.isEmpty == false) ? "PUT" : "POST"
    
    let task = URLSession.shared.dataTask(with: req) { (data, response, error) in
        
        if error != nil {
            completion(SPDError.fatal("database response error"))
            exit(0)
        }
        
        guard let json = data else {
            completion(SPDError.fatal("database response nil"))
            exit(0)
        }
        
        print(try! JSONSerialization.jsonObject(with: json, options: []))
        
        guard let result = try? JSONDecoder().decode(WrittenDocumentResult.self, from: json) else {
            completion(SPDError.fatal("failed to decode to expected JSON response"))
            exit(0)
        }
        
        completion(error)
        exit(0)
    }
    
    task.resume()
}

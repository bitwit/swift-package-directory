import Foundation

struct Package: Codable {
    var _id: String?
    var _rev: String?
    
    var name: String
    var full_name: String
    var description: String
    var html_url: String
    var keywords: String?
    
    mutating func apply(document: Document) {
        self._id = document._id
        self._rev = document._rev
    }

    mutating func buildKeywords() {
        var words = ""
        
        var lastWord = ""
        for char in name {
            let newWord = lastWord + String(char)
            lastWord = newWord
            words += "\(newWord) "
        }
        
        self.keywords = words + description + " " + full_name.replacingOccurrences(of: "/", with: " ")
    }
}

func getRepoInfo(name: String, completion: @escaping (Package?, Error?) -> ()) {
    
    let repoUrlString = "https://api.github.com/repos/\(name)"
    
    guard let url = URL(string: repoUrlString) else {
        completion(nil, SPDError.fatal("invalid url"))
        fatalError("invalid url")
    }

    let req = URLRequest(url: url)
    let task = URLSession.shared.dataTask(with: req) { (data, response, error) in
    
        if error != nil {
            fatalError("error in github response")
        }
    
        guard let json = data else {
            fatalError("error in github response data; empty")
        }
    
        //        print(req.curlString)
//        print(try! JSONSerialization.jsonObject(with: json, options: []))
    
        guard let result = try? JSONDecoder().decode(Package.self, from: json) else {
            completion(nil, SPDError.fatal("failed to decode to expected JSON response"))
            exit(0)
        }
        
        completion(result, error)
    }

    task.resume()
}

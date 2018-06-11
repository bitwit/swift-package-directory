import Foundation

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
            exit(1)
        }
        
        completion(result, error)
    }

    task.resume()
}

import Dispatch
import Foundation

struct Input: Codable {
    let query: String
    let cloudantUrl: String
    let searchIndex: String
}

struct Output: Codable {
    let docs: [Document]
}

struct Query: Codable {
    let selector: [String: String]
    let use_index: String
}

struct Document: Codable {
    var name: String?
    var full_name: String?
    var description: String?
    var html_url: String?
    var keywords: String?
}

enum SPDError: Error {
    case fatal(String)
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    
    guard false == param.query.isEmpty else {
        completion(nil, SPDError.fatal("query string must not be empty"))
        exit(0)
    }
    
    guard let url = URL(string: param.cloudantUrl + "/swift-packages-directory/_find") else {
        completion(nil, SPDError.fatal("invalid url"))
        exit(0)
    }
    
    let query = Query(
        selector: ["$text": param.query],
        use_index: param.searchIndex
    )

    var req = URLRequest(url: url)
    let reqData = try! JSONEncoder().encode(query)
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
        
//        print(req.curlString)
        print(try! JSONSerialization.jsonObject(with: json, options: []))
        
        guard let result = try? JSONDecoder().decode(Output.self, from: json) else {
            completion(nil, SPDError.fatal("failed to decode to expected JSON response"))
            exit(0)
        }
        
        completion(result, error)
        exit(0)
    }
    task.resume()
    RunLoop.main.run()
}

#if os(macOS)
guard let urlString = ProcessInfo().environment["cloudantUrl"] else {
   fatalError("no cloudantUrl provided")
}
guard let searchIndex = ProcessInfo().environment["searchIndex"] else {
    fatalError("no cloudantUrl provided")
}
main(param: Input(query: "sl", cloudantUrl: urlString, searchIndex: searchIndex)) { output, error in
    print(output, error)
}
#endif

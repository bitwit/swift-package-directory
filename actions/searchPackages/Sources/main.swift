import Dispatch
import Foundation

struct Input: Codable {
    let cloudantUrl: String
}

struct Output: Codable {
    let total_rows: Int
    let rows: [DocumentContainer]
}

struct DocumentContainer: Codable {
    let id: String
    let key: String
    let doc: Document?
}

struct Document: Codable {
    let title: String
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    
    guard let url = URL(string: param.cloudantUrl + "/swift-packages-directory/_all_docs?include_docs=true") else {
        fatalError("Invalid url")
    }
    let req = URLRequest(url: url)
    
    let task = URLSession.shared.dataTask(with: req) { (data, response, error) in
        
        if error != nil {
            fatalError(error!.localizedDescription)
        }
        
        guard let json = data else {
            fatalError("Data was nil")
        }
        
        print(req.curlString)
        
        print(try! JSONSerialization.jsonObject(with: json, options: []))
        
        guard let result = try? JSONDecoder().decode(Output.self, from: json) else {
            fatalError("failed to decode to expected JSON response")
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
main(param: Input(cloudantUrl: urlString)) { output, error in
    print(output, error)
}
#endif

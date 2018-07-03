import Foundation
import PromiseKit

public class Networking {
    
    public static var callCount = [String: Int]()
    
    public static func reportCallCount() {
        print(callCount)
    }
    
    public static func perform<T: Decodable>(_ request: URLRequest, transformingResponseTo responseType: T.Type, debug: Bool = false) -> Promise<T> {
        
        let host = request.url?.host ?? "unknown"
        callCount[host, default: 0] += 1
        
        return Promise { resolver in
            let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
                
                if let err = error {
                    resolver.reject(err)
                    return
                }
                
                guard let json = data else {
                    resolver.reject(SPDError.fatal("response nil"))
                    return
                }
                
                if debug {
                    print(request.url?.absoluteString ?? "request url n/a")
                    print(try! JSONSerialization.jsonObject(with: json, options: []))
                    print(request.cURL)
                }
                
                let decoder = JSONDecoder()
                decoder.dateDecodingStrategy = .iso8601
                guard let results = try? decoder.decode(T.self, from: json) else {
                    resolver.reject(SPDError.fatal("failed to decode to \(String.init(describing: T.self))"))
                    return
                }
                
                resolver.fulfill(results)
            }
            task.resume()
        }
    }
    
}

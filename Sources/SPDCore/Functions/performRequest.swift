import Foundation
import PromiseKit

fileprivate var callCount = [String: Int]()
public func reportCallCount() {
    print(callCount)
}

public func perform<T: Decodable>(request: URLRequest, transformingResponseTo responseType: T.Type, debug: Bool = false) -> Promise<T> {
    
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
                print(try! JSONSerialization.jsonObject(with: json, options: []))
            }
            
            guard let results = try? JSONDecoder().decode(T.self, from: json) else {
                resolver.reject(SPDError.fatal("failed to decode to \(String.init(describing: T.self))"))
                print(try! JSONSerialization.jsonObject(with: data!, options: []))
//                print(request.cURL)
                return
            }
            
            resolver.fulfill(results)
        }
        task.resume()
    }
}

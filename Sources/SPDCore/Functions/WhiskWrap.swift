import Foundation
import PromiseKit

public typealias WhiskOutput = Codable & GeneratableFromFunctionResult
public protocol GeneratableFromFunctionResult {
    associatedtype ResultType: Codable
    
    init(result: ResultType)
}

public func whiskWrap<T, O: WhiskOutput>(_ promise: Promise<T>, outputType: O.Type , completion: @escaping (O?, Error?) -> Void) where T == O.ResultType {
    
    let startTime = Date()
    promise.done { (result) in
        let output = O.init(result: result)
        completion(output, nil)
        print("task completed in \(-startTime.timeIntervalSinceNow)s")
        exit(0)
    }
    .catch { (err) in
            print(err)
            print("task worked for \(-startTime.timeIntervalSinceNow)s before error")
            
            guard let spdError = err as? SPDError else {
                completion(nil, err)
                exit(1)
            }
            
            switch spdError {
            case .earlyExit(let reason):
                print(reason)
                completion(nil, nil)
                exit(0)
            case .fatal(let reason):
                print(reason)
                completion(nil, spdError)
                exit(1)
            }
    }
    RunLoop.main.run()
}

import Foundation
import PromiseKit

public typealias WhiskOutput = Codable & GeneratableFromFunctionResult
public protocol GeneratableFromFunctionResult {
    associatedtype ResultType: Codable
    
    init(result: ResultType)
    init(error: SPDError)
}

public func whiskWrap<T, O: WhiskOutput>(_ promise: Promise<T>, outputType: O.Type , completion: @escaping (O?, Error?) -> Void) where T == O.ResultType {
    
    let startTime = Date()
    promise
        .tap({ _ in
            print("task ran for \(-startTime.timeIntervalSinceNow)s")
        })
        .done({ (result) in
            let output = O.init(result: result)
            completion(output, nil)
            exit(0)
        })
        .catch { (err) in
            guard let spdError = err as? SPDError else {
                completion(nil, err)
                exit(1)
            }
            
            let output = O.init(error: spdError)
            
            switch spdError {
            case .earlyExit:
                completion(output, nil)
                exit(0)
            case .fatal:
                completion(nil, spdError)
                exit(1)
            }
    }
    RunLoop.main.run()
}

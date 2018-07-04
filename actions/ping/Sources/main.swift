import Foundation
import PromiseKit
import SPDCore

struct Output: WhiskOutput {
    
    typealias ResultType = Bool
    
    let success: Bool
    
    init(result: Bool) {
        self.success = result
    }
}

func main(completion: @escaping (Output?, Error?) -> Void) -> Void {
    let task = Promise { $0.fulfill(true) }
    whiskWrap(task, outputType: Output.self, completion: completion)
}

#if os(macOS)
main { output, error in
    print(output, error)
}
#endif


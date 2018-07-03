import Foundation
import PromiseKit
import SPDCore

struct Input: Codable {
}

struct Output: Codable, GeneratableFromFunctionResult {
    
    typealias ResultType = String
    
    let success: Bool = true
    let result: String
    
    init(result: String) {
        self.result = result
    }
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    
    let task = Promise { $0.fulfill("Done") }
    whiskWrap(task, outputType: Output.self, completion: completion)

    // completion(Output.init(result: "yoyo"), nil)
}

#if os(macOS)
main(param: Input()) { output, error in
    print(output, error)
}
#endif


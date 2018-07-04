import Foundation
import PromiseKit
import SPDCore

struct Output: Codable, GeneratableFromFunctionResult {
    
    typealias ResultType = String
    
    let success: Bool = true
    let result: String
    
    init(result: String) {
        self.result = result
    }
}

func main(completion: @escaping (Output?, Error?) -> Void) -> Void {
    
    let task = Promise { $0.fulfill("Done") }
    whiskWrap(task, outputType: Output.self) { o, e in
        completion(o, e)
    }

    // completion(Output.init(result: "yoyo"), nil)
}

#if os(macOS)
main { output, error in
    print(output, error)
}
#endif


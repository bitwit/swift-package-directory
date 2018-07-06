import Foundation
import PromiseKit
import SPDCore

struct Input: Codable {
    let cloudantUrl: String
    let query: String
}

struct Output: WhiskOutput {

    typealias ResultType = [Package]

    let success: Bool
    let packages: [Package]
    let message: String
        
    init(result: ResultType) {
        self.success = true
        self.packages = result
        self.message = "Found \(result.count) Packages"
    }

     init(error: SPDError) {
        self.success = false
        self.packages = []
        self.message = String(describing: error)
    }
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    let cloudant = Cloudant(baseUrl: param.cloudantUrl)
    
    var sq = SearchQuery()
    sq.keyword = param.query
    let task = cloudant.search(query: sq)
    whiskWrap(task, outputType: Output.self, completion: completion)
}

#if os(macOS)
guard let urlString = ProcessInfo().environment["cloudantUrl"] else {
    fatalError("no cloudantUrl provided")
}
main(param: Input(cloudantUrl: urlString, query: "s l")) { output, error in
    print(output, error)
    exit(error == nil ? 0 : 1)
}
#endif


import Foundation
import PromiseKit
import SPDCore

struct Input: Codable {
    let cloudantUrl: String
    let query: String
}

struct Output: Codable {
    let packages: [Package]
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    let cloudant = Cloudant(baseUrl: param.cloudantUrl)
    
    var sq = SearchQuery()
    sq.keyword = param.query
    _ = cloudant.search(query: sq)
        .done({ packages in
            print(packages)
            print(packages.count, "packages found")
            completion(Output(packages: packages), nil)
        })
        .catch { err in
            completion(nil, err)
            exit(1)
    }
        .finally {
            exit(0)
    }
}

#if os(macOS)
guard let urlString = ProcessInfo().environment["cloudantUrl"] else {
    fatalError("no cloudantUrl provided")
}
guard let searchIndex = ProcessInfo().environment["searchIndex"] else {
    fatalError("no searchIndex provided")
}
main(param: Input(cloudantUrl: urlString, query: "s")) { output, error in
    print(output, error)
    exit(error == nil ? 0 : 1)
}
RunLoop.main.run()
#endif


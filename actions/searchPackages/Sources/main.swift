import Foundation
import PromiseKit
import SPDCore

struct Input: Codable {
    let cloudantUrl: String
    let query: String
    let searchIndex: String
}

struct Output: Codable {
    let package: Package?
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    let cloudant = Cloudant(baseUrl: param.cloudantUrl)
    _ = cloudant.search(term: param.query, searchIndex: param.searchIndex)
        .done({ packages in
            print(packages)
            print(packages.count, "packages found")
            completion(Output(package: packages.first), nil)
        })
        .catch { err in
            completion(nil, err)
    }
    RunLoop.main.run()
}

#if os(macOS)
guard let urlString = ProcessInfo().environment["cloudantUrl"] else {
    fatalError("no cloudantUrl provided")
}
guard let searchIndex = ProcessInfo().environment["searchIndex"] else {
    fatalError("no searchIndex provided")
}
main(param: Input(cloudantUrl: urlString, query: "s", searchIndex: searchIndex)) { output, error in
    print(output, error)
    exit(error == nil ? 0 : 1)
}
#endif


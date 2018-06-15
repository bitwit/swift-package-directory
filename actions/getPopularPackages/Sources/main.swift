import Foundation
import PromiseKit
import SPDCore

struct Input: Codable {
    let cloudantUrl: String
    let popularIndex: String
}

struct Output: Codable {
    let packages: [Package]
}

func main(param: Input, completion: @escaping (Output?, Error?) -> Void) -> Void {
    let cloudant = Cloudant(baseUrl: param.cloudantUrl)
    _ = cloudant.getMostPopular(popularIndex: param.popularIndex)
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
    RunLoop.main.run()
}

#if os(macOS)
guard let urlString = ProcessInfo().environment["cloudantUrl"] else {
    fatalError("no cloudantUrl provided")
}
guard let popularIndex = ProcessInfo().environment["popularIndex"] else {
    fatalError("no popularIndex provided")
}
main(param: Input(cloudantUrl: urlString, popularIndex: popularIndex)) { output, error in
    print(output, error)
    exit(error == nil ? 0 : 1)
}
#endif


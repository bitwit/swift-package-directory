import Vapor
import SPDCore
import PromiseKit

struct FindQuery: Codable {
    let query: String
}

struct AddRequest: Codable {
    let repository: String
}

public func routes(_ router: Router) throws {
    let cloudantUrl = Environment.get("cloudantUrl") !! "No cloudant url"
    let searchIndex = Environment.get("searchIndex") !! "No search index"
    let githubUsername = Environment.get("githubUsername") !! "githubUsername"
    let githubAccessToken = Environment.get("githubAccessToken") !! "githubAccessToken"

    router.get("search", use: { req throws -> Future<[Package]> in
        let findQuery = try req.query.decode(FindQuery.self)
        let promise = req.eventLoop.newPromise([Package].self)
        let cloudant = Cloudant(baseUrl: cloudantUrl)
        cloudant
            .search(term: findQuery.query, searchIndex: searchIndex)
            .bind(to: promise)
        return promise.futureResult
    })
    
    router.put("add", use: { req throws -> Future<Package> in
        return try req.content.decode(AddRequest.self)
            .then({ (addRequest) in
                
            let promise = req.eventLoop.newPromise(Package.self)
            let cloudant = Cloudant(baseUrl: cloudantUrl)
            let github = GitHub(username: githubUsername, accessToken: githubAccessToken)
            let packageManager = PackageManager(cloudant: cloudant, github: github)
            cloudant
                .find(repository: addRequest.repository)
                .then { (existing) in
                    return packageManager.createOrUpdatePackage(repositoryName: addRequest.repository, existingPackage: existing)
                }
                .bind(to: promise)
            return promise.futureResult
        })
    })

}

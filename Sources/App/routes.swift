import Vapor
import SPDCore
import PromiseKit

struct FindQuery: Codable {
    let query: String
}

struct AddRequest: Codable {
    let repository: String
}

struct PackagesContainer: Codable, Content {
    let packages: [Package]
}

struct PackageContainer: Codable, Content {
    let package: Package
}

public func routes(_ router: Router) throws {
    let cloudantUrl = Environment.get("cloudantUrl") !! "No cloudant url"
    let searchIndex = Environment.get("searchIndex") !! "No search index"
    let githubUsername = Environment.get("githubUsername") !! "githubUsername"
    let githubAccessToken = Environment.get("githubAccessToken") !! "githubAccessToken"
    
    router.get("/") { (req) in
        return req.redirect(to: "/index.html")
    }

    router.get("search", use: { req throws -> Future<PackagesContainer> in
        let findQuery = try req.query.decode(FindQuery.self)
        let promise = req.eventLoop.newPromise(PackagesContainer.self)
        let cloudant = Cloudant(baseUrl: cloudantUrl)
        var query = SearchQuery()
        query.selector = ["$text": findQuery.query]
        query.use_index = searchIndex
        cloudant
            .search(query: query)
            .map { PackagesContainer(packages: $0) }
            .bind(to: promise)
        return promise.futureResult
    })
    
    router.put("add", use: { req throws -> Future<PackageContainer> in
        return try req.content.decode(AddRequest.self)
            .then({ (addRequest) in
                
            let promise = req.eventLoop.newPromise(PackageContainer.self)
            let cloudant = Cloudant(baseUrl: cloudantUrl)
            let github = GitHub(username: githubUsername, accessToken: githubAccessToken)
            let packageManager = PackageManager(cloudant: cloudant, github: github)
            cloudant
                .find(repository: addRequest.repository)
                .then { (existing) in
                    return packageManager.createOrUpdatePackage(repositoryName: addRequest.repository, existingPackage: existing)
                }
                .map { PackageContainer(package: $0) }
                .bind(to: promise)
            return promise.futureResult
        })
    })

}

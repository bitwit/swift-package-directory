import Foundation
import PromiseKit

public class PackageManager {
    
    public let cloudant: Cloudant
    public let github: GitHub
    
    public init(cloudant: Cloudant, github: GitHub) {
        self.cloudant = cloudant
        self.github = github
    }
    
    public func updatePackagesInChunks(packages: [Package]) -> Promise<[Package]> {
        let chunkSize = 10
        let chunks = stride(from: 0, to: packages.count, by: chunkSize).map {
            Array(packages[$0..<min($0 + chunkSize, packages.count)])
        }
        
        let initialPromise: Promise<[Package]> = Promise { $0.fulfill([]) }
        return chunks.reduce(initialPromise, { (promiseChain, nextPackages) -> Promise<[Package]> in
            return promiseChain.then { prevPackages in
                return self.update(packages: nextPackages)
                    .then { resolvedPackages -> Promise<[Package]> in
                        let allPackagesSoFar = prevPackages + resolvedPackages
                        print("\n -- Updated \(allPackagesSoFar.count) packages so far \n")
                        return Promise { $0.fulfill(allPackagesSoFar) }
                }
            }
        })
    }
    
    public func update(packages: [Package]) -> Promise<[Package]> {
        let delayTime = 2.0
        
        let putTasks = packages.compactMap({ (package) -> Promise<Package>? in
            guard let repoName = package.full_name else { return nil }
            return createOrUpdatePackage(repositoryName: repoName, existingPackage: package)
        })
        
        return when(fulfilled: putTasks)
            .then { results -> Promise<[Package]> in
                return after(seconds: delayTime).then { _ in
                    return Promise<[Package]> { $0.fulfill(results) }
                }
        }
    }
    
    public func createOrUpdatePackage(repositoryName: String, existingPackage: Package?) -> Promise<Package> {
        
        let github = self.github
        return github.getRepoInfo(name: repositoryName)
            .then { (package) in
                return when(fulfilled: github.getRepoTags(name: repositoryName), github.getRepoTopics(name: repositoryName))
                            .map({ (package, $0, $1) })
            }
            .then { package, tags, topics -> Promise<Package> in
                var pkg = package
                pkg.latest_tag = tags.first?.name
                pkg.topics = topics
                if let doc = existingPackage {
                    print("[Updating] ", pkg.full_name!)
                    pkg.applyIdentification(from: doc)
                }
                return self.cloudant.writeToDB(package: pkg)
        }
    }
    
    //
    // WIP, needs to paginate over github results
    // TODO: paginate github results
    public func searchAndAddNewPackages() -> Promise<[Package]> {
        return cloudant.findAll()
            .map { (packages) -> [String: Package] in
                var pkgDict = [String: Package]()
                packages.forEach({ (pkg) in
                    guard let name = pkg.full_name else { return }
                    pkgDict[name] = pkg
                })
                return pkgDict
            }
            .then { (pkgDict) -> Promise<[Package]> in
               return self.github.searchForSwiftPackages(page: 1, limit: 100)
                    .then { (packages) -> Promise<[Package]> in
                        
                        let packageChecks = packages.map { self.github.determineIfRepoHasPackageSwiftFile(name: $0.full_name!) }
                        return when(fulfilled: packageChecks)
                            .map({ (validityChecks) -> [Package] in
                                return packages.enumerated().reduce([], { (acc, next) -> [Package] in
                                    let isValidPkg = validityChecks[next.offset]
                                    return (isValidPkg) ? acc + [next.element] : acc
                                })
                            })
                    }
                    .map({ (packages) -> [Package] in
                        let packagesToAdd = packages.compactMap { pkg -> Package? in
                            guard let name = pkg.full_name else { return nil }
                            if pkgDict[name] != nil {
                                return nil
                            }
                            return pkg
                        }
                        return packagesToAdd
                    })
                    .then { self.updatePackagesInChunks(packages: $0) }
            }
    }
}

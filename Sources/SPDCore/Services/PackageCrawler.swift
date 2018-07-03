import Foundation
import PromiseKit

public class PackageCrawler {
    
    let packageManager: PackageManager
    
    fileprivate var lastDateCrawled: Date = Date()
    fileprivate var crawlDateRangeComponents: DateComponents {
        var dc = DateComponents()
        dc.day = -3
        return dc
    }
    fileprivate var earliestDate: Date {
        let formatter = ISO8601DateFormatter()
        return formatter.date(from: "2014-01-01T00:00:00Z")!
    }
    
    fileprivate var existingPackages: [String: Package] = [:]
    fileprivate var githubRateLimitRemaining: Int = 0
    fileprivate var githubRateLimitRemainderCutOff: Int = 500
    
    fileprivate var appConfig: AppConfig!
    
    public init(packageManager: PackageManager) {
        self.packageManager = packageManager
    }
    
    public func execute() -> Promise<[Package]> {
        print("starting crawler")
        
        return when(fulfilled: getAppConfig(), getExistingPackageDictionary(), packageManager.github.getRateLimit())
            .then { (appConfig, existingPackages, rateLimits) -> Promise<[Package]> in
                
                self.appConfig = appConfig
                self.lastDateCrawled = appConfig.crawler.last_crawled_date
                self.existingPackages = existingPackages
                self.githubRateLimitRemaining = rateLimits.rate.remaining
                print("GH Rate Limit Remaining: ", self.githubRateLimitRemaining)
                if self.githubRateLimitRemaining <= self.githubRateLimitRemainderCutOff {
                    return Promise(error: SPDError.earlyExit("Approaching rate limit"))
                }
                return self.crawl()
            }
    }
    
    fileprivate func getAppConfig() -> Promise<AppConfig> {
        return packageManager.cloudant
            .getAppConfig()
    }
    
    fileprivate func getExistingPackageDictionary() -> Promise<[String: Package]> {
        return packageManager.cloudant.findAll()
            .map { (packages) -> [String: Package] in
                var pkgDict = [String: Package]()
                packages.forEach({ (pkg) in
                    guard let name = pkg.full_name else { return }
                    pkgDict[name] = pkg
                })
                return pkgDict
        }
    }
    
    fileprivate func crawl() -> Promise<[Package]> {
        return self.executeNextCrawl()
            .then { packages -> Promise<[Package]> in
                return self.saveProgress()
                    .map { _ in packages }
            }
            .then { packages -> Promise<[Package]> in
                let totalCallsSoFar = Networking.callCount["api.github.com", default: 0]
                print("total github calls so far/limit", totalCallsSoFar, self.githubRateLimitRemaining)
                if (self.githubRateLimitRemaining - totalCallsSoFar) > self.githubRateLimitRemainderCutOff {
                    print("attempting to crawl next range")
                    return self.crawl().map { packages + $0 }
                } else {
                    print("approaching rate limit, finishing up")
                    return Promise { $0.fulfill(packages) }
                }
        }
    }
    
    fileprivate func executeNextCrawl() -> Promise<[Package]> {
        
        let calendar = Calendar.init(identifier: .gregorian)
        
        //crawls backward in time
        let startDate = calendar.date(byAdding: crawlDateRangeComponents, to: lastDateCrawled)!
        let endDate = lastDateCrawled
        lastDateCrawled = startDate

        //reset if crawling earlier than 2014
        if endDate < earliestDate {
            print("reached earliest date, resetting crawler")
            lastDateCrawled = Date()
            return Promise { $0.fulfill([]) }
        }
        
        print("Crawling date: \(lastDateCrawled)")
        return fetchNewPackages(inRange: (startDate, endDate), existingPackages: existingPackages)
            .then(packageManager.updatePackagesInChunks(packages:))
    }
    
    fileprivate func saveProgress() -> Promise<Void> {
        var newConfig: AppConfig = appConfig
        newConfig.crawler.last_crawled_date = lastDateCrawled
  
        print("saving progress", newConfig)
        return packageManager.cloudant.setAppConfig(newConfig)
            .done({ (newDocResult) in
                newConfig._id = newDocResult.id
                newConfig._rev = newDocResult.rev
                self.appConfig = newConfig
            })
    }
    
    fileprivate func fetchNewPackages(inRange dateRange: (Date, Date), page: Int = 1, existingPackages: [String: Package]) -> Promise<[Package]> {
        
        print("fetching & filtering page \(page) in range\(dateRange)")
        
        let limit = 100
        var totalItems = 0
        
        return packageManager.github.searchForSwiftPackages(inDateCreationRange: dateRange, page: page, limit: limit)
            .map { searchResults -> [Package] in
                totalItems = searchResults.total_count
                return searchResults.items
            }
            .filterValues({ existingPackages[$0.full_name ?? "n/a"] == nil })
            .then(filterOutPackagesBasedOnReleaseTags)
            .then(filterOutPackagesBasedOnRepoContents)
            //determine if we have more paging to do before completion
            .then({ (pkgs) -> Promise<[Package]> in
                if totalItems > page * limit {
                    return self.fetchNewPackages(inRange: dateRange, page: page + 1, existingPackages: existingPackages)
                        .map { pkgs + $0 }
                }
                return Promise { $0.fulfill(pkgs) }
            })
    }
    
    fileprivate func filterOutPackagesBasedOnRepoContents(_ packages: [Package]) -> Promise<[Package]> {
        
        let repoContentGrabs = packages.map { self.packageManager.github.getRepoRootContents(name: $0.full_name!) }
        
        return when(fulfilled: repoContentGrabs)
            .map({ (repoContentsArray) -> [Package] in
                return packages.enumerated().reduce([], { (acc, next) -> [Package] in
                    let isValidPkg = self.confirm(package: next.element, meetsRepoContentsCriteria: repoContentsArray[next.offset])
                    return (isValidPkg) ? acc + [next.element] : acc
                })
            })
    }
    
    fileprivate func filterOutPackagesBasedOnReleaseTags(_ packages: [Package]) -> Promise<[Package]> {
        
        let repoTagGrabs = packages.map { self.packageManager.github.getRepoTags(name: $0.full_name!) }
        
        return when(fulfilled: repoTagGrabs)
            .map({ (repoTagsArray) -> [Package] in
                return packages.enumerated().reduce([], { (acc, next) -> [Package] in
                    let isValidPkg = self.confirm(package: next.element, meetsReleaseTagCriteria: repoTagsArray[next.offset])
                    return (isValidPkg) ? acc + [next.element] : acc
                })
            })
    }
    
    fileprivate func confirm(package: Package, meetsRepoContentsCriteria repoRootContents: GitRepoContents) -> Bool {
        
        var foundSwiftManifest = false
        for file in repoRootContents.tree {
            if file.path.lowercased() == "cartfile" {
                return false
            }
            if file.path.contains("podspec") {
                return false
            }
            if file.path == "Package.swift" {
                foundSwiftManifest = true
            }
        }
        
        return foundSwiftManifest
    }
    
    fileprivate func confirm(package: Package, meetsReleaseTagCriteria gitTags: [GitTag]) -> Bool {
        // Check for a semver tag
        // i.e. "0.1.0", currently something like "0.1.0-alpha" would not pass.
        let semver = "^[0-9]+\\.[0-9]+\\.[0-9]+$"
        return gitTags.contains(where: { (tag) -> Bool in
            let range = tag.name.range(of: semver, options: .regularExpression, range: nil, locale: nil)
            return range != nil
        })
    }
}

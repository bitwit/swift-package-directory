import Foundation

extension StringProtocol {
    
    fileprivate func brokenDownForKeywords() -> String {
        var keywords = ""
        var lastWord = ""
        for char in self {
            let newWord = lastWord + String(char)
            lastWord = newWord
            keywords += "\(newWord) "
        }
        return keywords
    }
}

public struct Package: Codable {
    public var _id: String?
    public var _rev: String?
    
    public var name: String?
    public var full_name: String?
    public var description: String?
    public var html_url: String?
    public var keywords: String?
    public var forks_count: Int?
    public var stargazers_count: Int?
    public var topics: [String]?
    
    public var latest_tag: String?
    
    public var last_package_update: Date?
    
    public mutating func applyIdentification(from package: Package) {
        self._id = package._id
        self._rev = package._rev
    }
    
    public mutating func buildKeywords() {
        var keywords = ""
        
        if let name = self.name {
            keywords += name.brokenDownForKeywords()
        }
        if let desc = self.description?.split(separator: " ").map({ $0.brokenDownForKeywords() }) {
            keywords += desc.joined(separator: " ")
        }
        if let fullName = self.full_name {
            keywords += fullName.replacingOccurrences(of: "/", with: " ")
        }
        if let topics = self.topics {
            keywords += topics
                .flatMap { $0.split(separator: "-") }
                .map { $0.brokenDownForKeywords() }
                .joined(separator: " ")
        }
        self.keywords = keywords
    }
    
}

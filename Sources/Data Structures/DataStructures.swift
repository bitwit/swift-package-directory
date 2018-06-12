import Foundation

public enum SPDError: Error {
    case fatal(String)
}

public struct DocumentContainer: Codable {
    public let id: String
    public let key: String
    public let doc: Package?
}

public struct Package: Codable {
    public var _id: String?
    public var _rev: String?
    
    public var name: String?
    public var full_name: String?
    public var description: String?
    public var html_url: String?
    public var keywords: String?
    
    public mutating func applyIdentification(from package: Package) {
        self._id = package._id
        self._rev = package._rev
    }
    
    public mutating func buildKeywords() {
        var keywords = ""
        keywords.append(self.name?.brokenDownForKeywords())
        
        if let name = self.name {
           keywords += name.brokenDownForKeywords()
        }
        if let desc = self.description?.split(separator: " ").map({ String($0).brokenDownForKeywords() }) {
            keywords += desc.joined(separator: " ")
        }
        if let fullName = self.full_name {
            keywords + = fullName.replacingOccurrences(of: "/", with: " ")
        }
        self.keywords = keywords
    }
    
}

extension String {
    
    public func brokenDownForKeywords() -> String {
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

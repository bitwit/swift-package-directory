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
        var words = ""
        
        guard let name = self.name else { return }
        
        var lastWord = ""
        for char in name {
            let newWord = lastWord + String(char)
            lastWord = newWord
            words += "\(newWord) "
        }
        
        self.keywords = words
            + (description ?? "")
            + " "
            + (full_name?.replacingOccurrences(of: "/", with: " ") ?? "")
    }
}

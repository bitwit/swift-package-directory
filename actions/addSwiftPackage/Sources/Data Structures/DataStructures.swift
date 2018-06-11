import Foundation

enum SPDError: Error {
    case fatal(String)
}

struct DocumentContainer: Codable {
    let id: String
    let key: String
    let doc: Package?
}

struct Package: Codable {
    var _id: String?
    var _rev: String?
    
    var name: String?
    var full_name: String?
    var description: String?
    var html_url: String?
    var keywords: String?
    
    mutating func applyIdentification(from package: Package) {
        self._id = package._id
        self._rev = package._rev
    }
    
    mutating func buildKeywords() {
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

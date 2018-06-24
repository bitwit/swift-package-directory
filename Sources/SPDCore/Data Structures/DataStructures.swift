import Foundation

public enum SPDError: Error {
    case fatal(String)
}

public struct SearchQuery: Codable {
    public var selector: [String: String] = [:]
    public var use_index: String = ""
    public var limit: Int = 10
    public var skip: Int = 0
    
    public init() {
    }
}

public struct DocumentContainer: Codable {
    public let id: String
    public let key: String
    public let doc: Package?
}


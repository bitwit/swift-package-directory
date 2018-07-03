import Foundation

public enum SPDError: Error {
    case fatal(String)
}

public struct SearchQuery: Codable {

    public var keyword: String = ""
    public var limit: Int = 10
    
    public init() {
        
    }
}

public struct DocumentContainer: Codable {
    public let id: String
    public let key: String?
    public let doc: Package?
}

public struct AppConfig: Codable {
    public var _id: String
    public var _rev: String
    public var crawler: CrawlerConfig

}

public struct CrawlerConfig: Codable {
    public var last_crawled_date: Date
}

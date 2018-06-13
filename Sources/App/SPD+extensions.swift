import Foundation
import Vapor
import PromiseKit
import SPDCore

extension Package: Content {}

extension SPDError: AbortError {
    public var status: HTTPResponseStatus {
        return HTTPResponseStatus.badRequest
    }
    
    public var reason: String {
        switch self {
        case .fatal(let errString):
            return errString
        }
    }
    
    public var identifier: String {
        return reason
    }
}

extension PromiseKit.Promise {
    func bind(to eventLoopPromise: EventLoopPromise<T>) {
        self.done(on: DispatchQueue.global()) { (result) in
            eventLoopPromise.succeed(result: result)
            }
            .catch { (error) in
                eventLoopPromise.fail(error: error)
        }
    }
}

infix operator !!

public func !! <T>(wrapped: T?, failureText: @autoclosure () -> String) -> T { if let x = wrapped { return x }
    fatalError(failureText())
}


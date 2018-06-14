import Vapor
import PromiseKit

/// Called before your application initializes.
public func configure(_ config: inout Config, _ env: inout Environment, _ services: inout Services) throws {
    
    // Make sure promisekit is off of main thread at all times
    PromiseKit.conf.Q = (map: DispatchQueue.global(), return: DispatchQueue.global())
    
    if let port = Environment.get("PORT")
        , let portNum = Int(port) {
        let serverConfig = NIOServerConfig.default(hostname: "0.0.0.0", port: portNum)
        services.register(serverConfig)
    }

    /// Register routes to the router
    let router = EngineRouter.default()
    try routes(router)
    services.register(router, as: Router.self)

    /// Register middleware
    var middlewares = MiddlewareConfig() // Create _empty_ middleware config
    middlewares.use(FileMiddleware.self) // Serves files from `Public/` directory
    middlewares.use(ErrorMiddleware.self) // Catches errors and converts to HTTP response
    services.register(middlewares)
}

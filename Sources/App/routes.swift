import Vapor
import SPDCore

struct TestBody: Content {
    let success: Bool
}

public func routes(_ router: Router) throws {

    router.get("search", use: { req -> Future<TestBody> in
        let promise = req.eventLoop.newPromise(TestBody.self)
        promise.succeed(result: TestBody.init(success: true))
        return promise.futureResult
    })

    // Example of configuring a controller
    let todoController = TodoController()
    router.get("todos", use: todoController.index)
    router.post("todos", use: todoController.create)
    router.delete("todos", Todo.parameter, use: todoController.delete)
}

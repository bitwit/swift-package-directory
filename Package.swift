// swift-tools-version:4.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "swift-package-directory",
    products: [
        .library(name: "SPDCore", targets: ["SPDCore"])
    ],
    dependencies: [
        .package(url: "https://github.com/bitwit/PromiseKit.git", from: "7.0.0"),
        .package(url: "https://github.com/vapor/vapor.git", from: "3.0.0"),
        .package(url: "https://github.com/vapor/fluent-sqlite.git", from: "3.0.0-rc.2")
    ],
    targets: [
        .target(
            name: "SPDCore",
            dependencies: ["PromiseKit"]),
        .target(
            name: "SPDCorePlayground",
            dependencies: ["SPDCore"]),

        .target(name: "App", dependencies: ["FluentSQLite", "Vapor", "SPDCore"]),

        .target(name: "Run", dependencies: ["App"]),
        .testTarget(name: "AppTests", dependencies: ["App"])
    ]
)

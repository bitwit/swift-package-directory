// swift-tools-version:4.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "swift-package-directory",
    products: [
        .library(name: "SPDCore", targets: ["SPDCore"])
    ],
    dependencies: [
        .package(url: "https://github.com/mxcl/PromiseKit.git", from: "6.3.1"),
    ],
    targets: [
        .target(
            name: "SPDCore",
            dependencies: ["PromiseKit"]),
        .target(
            name: "SPDCorePlayground",
            dependencies: ["SPDCore"])
    ]
)

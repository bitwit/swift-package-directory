// swift-tools-version:4.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "search-packages",
    dependencies: [
        .package(url: "../../", from: "0.0.9")
    ],
    targets: [
        .target(
            name: "Action",
            dependencies: ["SPDCore"],
            path: "Sources"),
    ]
)
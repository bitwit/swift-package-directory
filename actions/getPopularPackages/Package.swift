// swift-tools-version:4.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "get-popular-packages",
    dependencies: [
        .package(url: "../../", from: "0.0.11")
    ],
    targets: [
        .target(
            name: "Action",
            dependencies: ["SPDCore"],
            path: "Sources"),
    ]
)

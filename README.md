# Swift Package Directory

Code for http://swiftpackage.directory

The current design is quite experimental and justification [pairs with this blog entry](http://bitwit.ca/blog/2018-06-19-serverless-or-not)

### Note on the blog entry code

Original code at the time of this blog entry is here: https://github.com/bitwit/swift-package-directory/tree/serverless-blog-original-source

This is server side swift running via OpenWhisk Serverless functions. The source code at the time of blogging also includes a Vapor wrapper around the logic so it could be deployed in a more traditional fashion. I've cleaned up the heirarchy in the meantime to focus on keeping the code as in touch with what's actually live right now.
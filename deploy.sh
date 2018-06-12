#!/bin/bash

# This is copied mostly from IBM Serverless documentation
# Currently it appears that 
# swift executables get wrapped with a little extra to function properly

set -ex

if [ -z "$1" ] ; then
    echo 'Error: Missing action name'
    exit 1
fi

OUTPUT_DIR="build"
RUNTIME="ibmfunctions/action-swift-v4.1"
BASE_PATH="/swift4Action"
DEST_SOURCE="/$BASE_PATH/actions/$1/Sources"
DEST_PACKAGE_SWIFT="$BASE_PATH/spm-build/Package.swift"

BUILD_FLAGS=""
if [ -n "$2" ] ; then
    BUILD_FLAGS=${2}
fi

echo "Using runtime $RUNTIME to compile swift"
docker run --rm --name=compile-ow-swift -it -v "$(pwd):/owexec" $RUNTIME bash -ex -c "

if [ -f \"/owexec/$OUTPUT_DIR/$1.zip\" ] ; then
    rm \"/owexec/$OUTPUT_DIR/$1.zip\"
fi

echo 'Setting up build...'

#copy everything
mkdir $BASE_PATH/actions/
mkdir $BASE_PATH/actions/$1
cp -R /owexec/.git $BASE_PATH/

cp -R /owexec/actions/$1/Sources $BASE_PATH/actions/$1
cp -R /owexec/actions/$1/Package.swift $BASE_PATH/actions/$1/Package.swift
cp -R /owexec/Sources $BASE_PATH/
cp /owexec/Package.swift $BASE_PATH/

# Add in the OpenWhisk specific bits
cat $BASE_PATH/epilogue.swift >> $DEST_SOURCE/main.swift
echo '_run_main(mainFunction:main)' >> $DEST_SOURCE/main.swift

# Only for Swift4
echo 'Adding wait to deal with escaping'
echo '_ = _whisk_semaphore.wait(timeout: .distantFuture)' >> $DEST_SOURCE/main.swift

echo \"Compiling $1...\"
# cd /$BASE_PATH/spm-build
cd $DEST_SOURCE

# cp /owexec/actions/$1/Package.swift $DEST_PACKAGE_SWIFT
# cat $DEST_PACKAGE_SWIFT

# we have our own Package.swift, do a full compile
swift build ${BUILD_FLAGS} -c release --verbose

echo 'Creating archive $1.zip...'
#.build/release/Action
mkdir -p /owexec/$OUTPUT_DIR
zip \"/owexec/$OUTPUT_DIR/$1.zip\" .build/release/Action
"

bx wsk action update swift-package-directory/$1 build/$1.zip --kind swift:4.1
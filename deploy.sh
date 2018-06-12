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
WHISK_SWIFT="$BASE_PATH/spm-build/Sources/Action/_Whisk.swift"

BUILD_FLAGS=""
if [ -n "$2" ] ; then
    BUILD_FLAGS=${2}
fi
SWIFT_BUILD_COMMAND="swift build ${BUILD_FLAGS} -c release"

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

ls -a -l $BASE_PATH/spm-build/Sources/Action
# Add in the OpenWhisk specific bits
cp $WHISK_SWIFT $DEST_SOURCE/_Whisk.swift
cat $BASE_PATH/epilogue.swift >> $DEST_SOURCE/main.swift
echo '_run_main(mainFunction:main)' >> $DEST_SOURCE/main.swift

# Only for Swift4
echo 'Adding wait to deal with escaping'
echo '_ = _whisk_semaphore.wait(timeout: .distantFuture)' >> $DEST_SOURCE/main.swift

cat $DEST_SOURCE/main.swift 

echo \"Compiling $1...\"
cd $BASE_PATH/actions/$1

BIN_PATH=\$($SWIFT_BUILD_COMMAND --show-bin-path)
$SWIFT_BUILD_COMMAND

stat \$BIN_PATH/Action

echo 'Creating archive $1.zip...'
cd \$BIN_PATH
mkdir -p /owexec/$OUTPUT_DIR
zip \"/owexec/$OUTPUT_DIR/$1.zip\" Action
"

bx wsk action update swift-package-directory/$1 build/$1.zip --kind swift:4.1
#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [ "$1" == "" ] ; then
    printf "\nNisi zadao verziju Docker image-a koji treba buildati"
    printf "\n\nSintaksa:\n\n    build-image.sh 1.0.0\n\n"
    exit 1
fi
# čitam varijable iz .env datoteke (BASE_PATH, CSS_BUILDER_VERSION ...)
set -o allexport
source .env
set +o allexport

IMAGE_NAME=e-igre-management
IMAGE_TAG=$REGISTRY_NAME/$IMAGE_NAME:$1
FAIL_MSG="BUILD FAILED :("

read -p "BUILD: Push new image to registry [y/n]? " -n 1 -r
echo    # (optional) move to a new line

PUSH_IMAGE_TO_REPO="$REPLY"

docker build . -t $IMAGE_TAG \
    --build-arg APP_VERSION=$1 \
    --build-arg BASE_PATH=$BASE_PATH \
    --build-arg CSS_BUILDER_VERSION=$CSS_BUILDER_VERSION \
    || { echo "" ; echo $FAIL_MSG ; echo "" ; exit 1; }

if [[ "$PUSH_IMAGE_TO_REPO" =~ ^[Yy]$ ]]
then
    printf "\nPushing image ...\n\n"
    docker push $IMAGE_TAG
fi

printf "\nBUILD: all done!\n\n"

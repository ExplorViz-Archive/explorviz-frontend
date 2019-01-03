#!/bin/bash
echo "$DOCKER_PW" | docker login -u "$DOCKER_LOGIN" --password-stdin
docker push USER/REPO
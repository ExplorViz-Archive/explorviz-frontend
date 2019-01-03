#!/bin/bash
echo "Building Docker image"
ember try:one "build with ember-lts-3.4.7"
docker build -t explorviz/explorviz-frontend:latest .
echo "$DOCKER_PW" | docker login -u "$DOCKER_LOGIN" --password-stdin
docker push explorviz/explorviz-frontend:latest
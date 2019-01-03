#!/bin/bash
echo "Building Docker image"
docker build -t explorviz/explorviz-frontend:dev .
echo "$DOCKER_PW" | docker login -u "$DOCKER_LOGIN" --password-stdin
docker push explorviz/explorviz-frontend:dev
#!/bin/bash
echo "Building Docker image"

ember try:one "build with ember-lts-3.4.7"

echo "$DOCKER_PW" | docker login -u "$DOCKER_LOGIN" --password-stdin

if [[ "$TRAVIS_BRANCH" == 'dev-1' ]]; then
  docker build -t explorviz/explorviz-frontend:dev .
  docker push explorviz/explorviz-frontend:dev
elif [[ "$TRAVIS_BRANCH" == 'master' ]]; then
  docker build -t explorviz/explorviz-frontend:latest .
  docker push explorviz/explorviz-frontend:latest
else
  echo "Unknown branch for Docker image."
fi
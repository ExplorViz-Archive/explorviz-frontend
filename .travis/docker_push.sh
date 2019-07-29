#!/bin/bash
echo "Building Docker image"

#ember test

echo "$DOCKER_PW" | docker login -u "$DOCKER_LOGIN" --password-stdin

if [[ "$TRAVIS_BRANCH" == 'dev-1' ]]; then
  docker build -t explorviz-frontend .
  
  docker tag explorviz-frontend explorviz/explorviz-frontend:dev-$TRAVIS_COMMIT
  docker tag explorviz-frontend explorviz/explorviz-frontend:dev
  
  docker push explorviz/explorviz-frontend
elif [[ "$TRAVIS_BRANCH" == 'master' ]]; then
  docker build -t explorviz-frontend .
  
  docker tag explorviz-frontend explorviz/explorviz-frontend:latest-$TRAVIS_COMMIT
  docker tag explorviz-frontend explorviz/explorviz-frontend:latest
  
  docker push explorviz/explorviz-frontend
else
  echo "Unknown branch for Docker image."
fi

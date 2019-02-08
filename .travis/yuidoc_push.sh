#!/bin/bash

if [ "$TRAVIS_REPO_SLUG" == "ExplorViz/explorviz-frontend" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then

  echo -e "Publishing yuidoc...\n"

  yuidoc .
  cp -R docs $HOME/docs

  cd $HOME
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
  git clone --quiet --branch=gh-pages https://$PersonalAccessToken@github.com/ExplorViz/explorviz-frontend gh-pages > /dev/null

  cd gh-pages
  git rm -rf *
  cp -Rf $HOME/docs/* .
  git add -f .
  git commit -m "Latest Yuidoc on successful Travis build $TRAVIS_BUILD_NUMBER auto-pushed to gh-pages"
  git push -fq origin gh-pages > /dev/null

  echo -e "Published Yuidoc to gh-pages.\n"

fi
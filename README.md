# explorviz-ui-frontend
<img src="https://travis-ci.org/ExplorViz/explorviz-ui-frontend.svg?branch=master" alt="Build Status"> 
[![Stories in Backlog](https://badge.waffle.io/ExplorViz/explorviz-ui-frontend.png?label=ready&title=Backlog)](http://waffle.io/ExplorViz/explorviz-ui-frontend) 
[![Stories in Ready](https://badge.waffle.io/ExplorViz/explorviz-ui-frontend.png?label=ready&title=Ready)](http://waffle.io/ExplorViz/explorviz-ui-frontend)
[![Stories in Progress](https://badge.waffle.io/ExplorViz/explorviz-ui-frontend.png?label=ready&title=In%20Progress)](http://waffle.io/ExplorViz/explorviz-ui-frontend)
[![Stories in Done](https://badge.waffle.io/ExplorViz/explorviz-ui-frontend.png?label=ready&title=Done)](http://waffle.io/ExplorViz/explorviz-ui-frontend)


This project is a wip replica of ExplorViz's visualization component. It substitutes [GWT](http://www.gwtproject.org/) client-code with [EmberJS](https://www.emberjs.com/). This is only the frontend, you will need the [backend](https://github.com/ExplorViz/explorviz-ui-backend) as well.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation (Generic)

* `git clone <repository-url>` this repository
* `cd explorviz-ui-frontend`
* `npm install`
* `bower install`

## Installation (Windows)
* install NodeJS
* npm install -g ember-cli
* npm install -g phantomjs
* npm install -g bower

## Used IDE

* Webstorm 2016.3
* EmberJS Plugin

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.
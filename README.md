# Explorviz UI Frontend
<a href="https://travis-ci.org/ExplorViz/explorviz-ui-frontend"><img src="https://travis-ci.org/ExplorViz/explorviz-ui-frontend.svg?branch=master" alt="Build Status"></a>
<a href="https://david-dm.org/ExplorViz/explorviz-ui-frontend"><img src="https://david-dm.org/ExplorViz/explorviz-ui-frontend.svg?branch=master" alt="Dependency Status"></a>
<a href="https://david-dm.org/ExplorViz/explorviz-ui-frontend?type=dev"><img src="https://david-dm.org/ExplorViz/explorviz-ui-frontend/dev-status.svg" alt="devDependencies status"></a>
[![](https://img.shields.io/docker/pulls/explorviz/explorviz-docker.svg)](https://hub.docker.com/r/explorviz/explorviz-docker "Click to view the image on Docker Hub")

This project is a wip replica of ExplorViz's visualization component. It substitutes [GWT](http://www.gwtproject.org/) client-code with [EmberJS](https://www.emberjs.com/). This is only the frontend, you will need the [backend](https://github.com/ExplorViz/explorviz-ui-backend) as well.

## Documentation (WIP)

* The API documentation is available at https://explorviz.github.io/explorviz-ui-frontend/

## Deployment
There are two options for you at the moment. Browse to our [docker repository](https://github.com/ExplorViz/explorviz-docker). 
* Clone the repository and deploy the built artifacts "explorviz-backend.war" and "explorviz-frontend" in a Tomcat
* **OR** Use Docker as shown in the respective README.md

## Development

### Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

### Installation (Generic)

* `git clone <repository-url>` this repository
* `cd explorviz-ui-frontend`
* `npm install`

### Installation (Windows)
* install NodeJS
* npm install -g ember-cli
* npm install -g phantomjs
* Follow installation (Generic)

### Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

#### Running Tests

* `ember test`
* `ember test --server`

#### Building

* `ember build` (development)
* `ember build --environment production` (production)

#### Generating API Documentation
* `yuidoc .` (Might need to delete content of *tmp* folder. Be aware! The result of this command should be commited at the end of your development, since it generates a lot of LoC.)

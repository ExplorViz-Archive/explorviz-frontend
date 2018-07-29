# ExplorViz Frontend
<a href="https://travis-ci.org/ExplorViz/explorviz-frontend"><img src="https://travis-ci.org/ExplorViz/explorviz-frontend.svg?branch=master" alt="Build Status"></a>
[![Build status](https://ci.appveyor.com/api/projects/status/am0ea9r6sp2h74x7/branch/appveyor?svg=true)](https://ci.appveyor.com/project/Alexander-Krause/explorviz-frontend/branch/appveyor)
<a href="https://david-dm.org/ExplorViz/explorviz-frontend"><img src="https://david-dm.org/ExplorViz/explorviz-frontend.svg?branch=master" alt="Dependency Status"></a>
<a href="https://david-dm.org/ExplorViz/explorviz-frontend?type=dev"><img src="https://david-dm.org/ExplorViz/explorviz-frontend/dev-status.svg" alt="devDependencies status"></a>
[![](https://img.shields.io/docker/pulls/explorviz/explorviz-docker.svg)](https://hub.docker.com/r/explorviz/explorviz-docker "Click to view the image on Docker Hub") [![Greenkeeper badge](https://badges.greenkeeper.io/ExplorViz/explorviz-frontend.svg)](https://greenkeeper.io/)

This project is a WIP replica of ExplorViz's visualization component. It substitutes [GWT](http://www.gwtproject.org/) client-code with [EmberJS](https://www.emberjs.com/). This is only the frontend, you will need the [backend](https://github.com/ExplorViz/explorviz-backend) as well for production. However, you can mock the backend as shown in the development section below.

## Documentation (Work in progress)
The API documentation is available [here](https://explorviz.github.io/explorviz-frontend/).

## Deployment
There are two options for you at the moment. Browse to our [docker repository](https://github.com/ExplorViz/explorviz-docker). 
* Clone the repository and deploy the built artifacts "explorviz-backend.war" and "explorviz-frontend" in a Tomcat
* **OR** Use Docker as shown in the respective README.md

## Development

### Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) with NPM (currently 8.9.4 LTS)

### Installation (Generic)

* `git clone <repository-url>` this repository
* `cd explorviz-frontend`
* `npm install -g ember-cli`
* `npm install -g yuidocjs`
* `npm install`

### Running / Development

* `ember serve` or `ember s`
* Visit the frontend at [http://localhost:4200](http://localhost:4200).

### Mocking the Backend

You can mock the backend, for example if you don't need live data for your development (or as showcase).
Therefore, you are not required to download and run the ExplorViz Backen Java project.
To achieve this, run the frontend with `ENABLE_MOCK=true ember s --environment=mocked`.

#### Testing

* `npm test` or `ember test` / `ember test --server`

#### Building

* `npm build` or `ember build` (development) / `ember build --environment production` (production)

#### Generating API Documentation
* `yuidoc .` (Might need to delete content of *tmp* folder. Be aware! The result of this command should be commited at the end of your development, since it generates a lot of LoC.)

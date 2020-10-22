## End-To-End Testing
The E2E-tests folder is concerned with End-To-End (E2E) tests using [gauge](https://gauge.org/) and [taiko](https://taiko.dev/).


## Prerequisites
To run the provided E2E tests, a realistic environment needs to be supplied. In general, the following steps are necessary.
* Build and run the backend (e.g. using a docker configuration and `docker-compose`)
* Build and run the frontend (using `ember serve`)
* Start a monitored applciation like the ExplorViz [Sample application](https://github.com/ExplorViz/sampleApplication)
* Install the required node modules for gauge and taiko.

## Automated test runs
The provided tests can be run by executing `gauge run specs`. 
Ideally, the E2E tests should be executed automatically (via TravisCI) to recognize severe failures quickly. 
Such a failure could be as a simple as a failing login due to a minor change in the frontend or backend.


## Caveats
Currently, no monitored application is provided.
Additionally, to enable meaningful screenshot comparison tests, the monitored
application should have a static or at least predictable structure and dynamic data.
For this reason, a future implementation of the backend should provide standardized monitoring data for testing purposes.
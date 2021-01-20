import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from 'explorviz-frontend/config/environment';

const { APP } = ENV;

/**
* This Adapter operates as communication abstraction for all network requests,
* that refer to Timestamp objects. It provides functions for fetching,
* updating and uploading. However, at the time of writing this documentation
* only fetching is implemented by the backend.
*
* @class Timestamp-Adapter
* @extends DS.JSONAPIAdapter
*
* @module explorviz
* @submodule network
*/
export default class TimestampAdapter extends JSONAPIAdapter {
  host = APP.API_ROOT;

  namespace = 'v1';
}

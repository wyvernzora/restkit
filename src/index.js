/**
 * index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const _            = require('lodash');
const Resource     = require('./resource');
const Endpoint     = require('./endpoint');



function RestKit(defaults, options, children) {

  /* {options} is optional */
  if (!children) {
    children = options;
    options = { };
  }

  /* Return a REST API client factory */
  return function(config = { }) {

    /* Clone config, and apply default values */
    config = _.assign({ }, defaults, config);
    const client = { config$: config };

    /* Make sure all required config arguments are there */
    for (const k of (options.required || [ ])) {
      if (typeof config[k] === 'undefined') {
        throw new Error(`Missing required config parameter '${k}'`);
      }
    }

    /* Build the API in question */
    for (const k of Object.keys(children)) {
      client[k] = children[k](config);
    }

    return client;
  };
}


RestKit.Resource = Resource;
RestKit.Endpoint = Endpoint;


module.exports = RestKit;

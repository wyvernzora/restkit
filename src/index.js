/**
 * index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const _            = require('lodash');



function RestKit(defaults, options, children) {

  /* {options} is optional */
  if (!children) {
    children = options;
    options = { };
  }

  /* Return a REST API client factory */
  return function(config) {
    const client = { };

    /* Apply default values */
    config = _.defaults(config, defaults);

    /* Make sure all required config arguments are there */
    for (const k of (options.required || [ ])) {
      if (!config[k]) {
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
module.exports = RestKit;

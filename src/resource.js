/**
 * resource.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const Endpoint     = require('./endpoint');


function Resource(spec, children = { }) {
  return function(config) {
    const res = { };

    /**
     * Create endpoints
     */
    for (const key of Object.keys(spec)) {
      res[key] = Endpoint(config, spec);
    }


    /**
     * Attach children
     */
    for (const key of Object.keys(children)) {
      res[key] = children[key](config);
    }


    return res;
  };
}
module.exports = Resource;

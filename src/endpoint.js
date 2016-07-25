/**
 * endpoint.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 *
 * This function creates a caller function for the API endpoint using
 * configuration parameters supplied in the {spec} object.
 */
const _            = require('lodash');
const Request      = require('request-promise');
const UrlSubst     = require('./util/url-subst');


function Endpoint(config, {
  path,
  params           = [ ],
  query            = { },
  method           = 'GET',
  pre              = () => { },
  post             = () => { },
  error            = () => { }
}) {
  if (!path) {
    throw new Error("Missing parameter 'path'");
  }


  /**
   * Build the actual endpoint path
   */
  const template = UrlSubst(config.root, path);


  /**
   * Support array query
   */
  if (_.isArray(query)) {
    query = query
      .map(i => ({ [i]: i }))
      .reduce(Object.assign);
  }


  /*
   * Create the binding function
   * Signature: (...params, [data], [options])
   */
  const fn = async function(...args) {
    let data = { };
    let options = { };

    /* Make sure array at least contains ${params.length} elements */
    const extra = args.length - params.length;
    if (extra < 0) {
      throw new Error(`Endpoint expects at least ${params.length} arguments`);
    }

    /* Get extra data and options */
    switch (extra) {
      case 0:
        break;
      case 1:
        data = args[args.length - 1];
        break;
      case 2:
        data = args[args.length - 2];
        options = args[args.length - 1];
        break;
      default:
        throw new Error(`Endpoint expects at most ${params.length + 2} arguments`);
    }

    /* Move pre-mapped parameters to the main data part */
    for (let i = 0; i < params.length; i++) {
      data[params[i]] = args[i];
    }

    /* Build out the base request data */
    const req = {
      method,
      json: true,
      uri: template(Object.assign({ }, config.params, data)),
      headers: options.headers || { },
      resolveWithFullResponse: true
    };

    /* Grab any common headers specified in config */
    for (const key of Object.keys(config.headers)) {
      if (!req.headers[key]) {
        req.headers[key] = config.headers[key];
      }
    }

    /* Prepare the request body */
    req.body = _
      .chain(data)
      .omit(...template.params)
      .omit(...Object.keys(query))
      .defaults(config.body)
      .value();

    /* Prepare the query string */
    req.qs = _
      .chain(data)
      .pick(...Object.keys(query))
      .mapKeys((v, k) => query[k])
      .defaults(config.query)
      .value();

    /* Run the pre-request hook now */
    run(fn, config.pre, req);
    run(fn, pre, req);

    /* Send out the request */
    let response;
    try {
      response = await Request(req);
    } catch (err) {
      run(fn, error, err, response);
      throw err; // Just in case we did not throw from error handler
    }

    /* Run the post-request hooks now */
    run(fn, config.post, response);
    run(fn, post, response);


    return response.body;
  };


  /**
   * Attach parent config to the fn itself
   */
  fn.config$ = config;
  fn.template$ = template;


  return fn.bind(fn);
}
module.exports = Endpoint;


/**
 * Runs a series of hook function with the specified context.
 */
function run(context, hook, ...args) {
  if (!hook) { return; }
  hook = [].concat(hook);

  for (const f of hook) {
    f.call(context, ...args);
  }
}

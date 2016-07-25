/**
 * test/resource.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const test         = require('ava');

const Endpoint     = require('../src/endpoint');
const Resource     = require('../src/resource');


/**
 * Config data
 */
const config = {
  get: {
    path: '/get',
    query: ['test']
  }
};
const child = {
  post: {
    method: 'POST',
    path: '/post'
  }
};


/**
 * Test cases
 */
test(async t => {

  const res = Resource(config, { test: Resource(child) })({
    root: 'https://echo.getpostman.com',
    headers: { }
  });

  t.is(typeof res.get, 'function');
  t.is(typeof res.test.post, 'function');

});

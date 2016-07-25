/**
 * test/index.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const test         = require('ava');

const RestKit      = require('../src');


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
test(t => {

  const api = RestKit({
    root: 'https://echo.getpostman.com',
    headers: { }
  }, {
    foo: RestKit.Resource(config),
    bar: RestKit.Resource(child)
  });

  t.is(typeof api, 'function');

  const client = api({ root: 'foobar' });

  t.is(client.config$.root, 'foobar');

});


test('no children', t => {

  const api = RestKit({
    root: 'https://echo.getpostman.com',
    headers: { }
  }, { });

  const client = api();

  t.deepEqual(Object.keys(client), [ 'config$', 'options$' ]);

});


test('missing config', t => {

  const api = RestKit({
    root: 'https://echo.getpostman.com',
    headers: { }
  }, {
    required: [ 'foo', 'bar' ]
  }, { });

  const f = () => api({ foo: 0 });

  t.throws(f, "Missing required config parameter 'bar'");

});


test('missing root', t => {

  const f = () => RestKit({ }, { });

  t.throws(f, "Missing required parameter 'defaults.root'");

});


test('oncreate', t => {

  const api = RestKit({
    root: 'https://echo.getpostman.com',
    headers: { }
  }, {
    oncreate() { this.config$.foo = 'bar'; }
  }, { });

  const client = api();

  t.is(client.config$.foo, 'bar');

});

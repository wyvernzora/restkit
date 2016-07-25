/**
 * test/endpoint.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const test         = require('ava');

const Endpoint     = require('../src/endpoint');


/**
 * Common configuration data
 */
const config = {
  root: 'https://echo.getpostman.com',
  headers: {
    Authorization: 'basic cG9zdG1hbjpwYXNzd29yZA=='
  },
  instance$: { options$: { json: true } }
};


/**
 * Test cases
 */
test(async t => {

  const ep = Endpoint(config, {
    path: '/get'
  });

  const r = await ep({ });

  t.is(r.url, 'https://echo.getpostman.com/get');

});


test('too few arguments', async t => {

  const ep = Endpoint(config, {
    path: '/get',
    params: ['id']
  });

  const r = ep();

  t.throws(r, 'Endpoint expects at least 1 arguments');

});


test('too many params', async t => {

  const ep = Endpoint(config, {
    path: '/get',
    params: ['id']
  });

  const r = ep(1, 2, 3, 4);

  t.throws(r, 'Endpoint expects at most 3 arguments');

});


test('query', async t => {

  const ep = Endpoint(config, {
    path: '/get',
    query: { test: 'test_id' }
  });

  const r = await ep({ test: 123 });

  t.is(r.args.test_id, '123');

});


test('query array', async t => {

  const ep = Endpoint(config, {
    path: '/get',
    query: ['test']
  });

  const r = await ep({ test: 123 });

  t.is(r.args.test, '123');

});


test('data w/out options', async t => {

  const ep = Endpoint(config, {
    method: 'POST',
    path: '/post',
    params: ['id']
  });

  const r = await ep(123, { foo: 'bar' });

  t.is(r.data.id, 123);
  t.is(r.data.foo, 'bar');

});


test('data w/ options', async t => {

  const ep = Endpoint(config, {
    path: '/headers',
    params: ['id']
  });

  const r = await ep(123, { foo: 'bar' }, {
    headers: {
      Authorization: 'basic foobarbaz'
    }
  });

  t.is(r.headers.authorization, 'basic foobarbaz');

});


test('param w/out data or options', async t => {

  const ep = Endpoint(config, {
    path: '/get'
  });

  const r = await ep(123);

  t.is(r.url, 'https://echo.getpostman.com/get');

});


test('error hook', async t => {

  const ep = Endpoint(config, {
    path: '/statua/:id',
    params: ['id'],
    error: err => {
      err.message = 'foobarbaz';
      throw err;
    }
  });

  const r = ep(404);

  t.throws(r, 'foobarbaz');

});


test('error hook w/out rethrow', async t => {

  const ep = Endpoint(config, {
    path: '/status/:id',
    params: ['id']
  });

  const r = ep(404);

  t.throws(r, '404 - {"status":404}');

});


test('pre-request hook', async t => {

  const ep = Endpoint(config, {
    method: 'POST',
    path: '/post',
    pre: req => { req.body.hello = 'world'; }
  });

  const r = await ep({ foo: 'bar' });

  t.is(r.data.hello, 'world');
  t.is(r.data.foo, 'bar');

});


test('post-request hook', async t => {

  const ep = Endpoint(config, {
    method: 'POST',
    path: '/post',
    post: res => { res.body.hello = 'world'; }
  });

  const r = await ep({ foo: 'bar' });

  t.is(r.hello, 'world');
  t.is(r.data.foo, 'bar');

});


test('no path', async t => {

  const e = () => Endpoint(config, {
    method: 'POST'
  });

  t.throws(e, "Missing parameter 'path'");

});

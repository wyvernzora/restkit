/**
 * test/util/url-subst.spec.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const test         = require('ava');

const UrlSubst     = require('../../src/util/url-subst');


test(t => {

  const base = 'https://example.com:1234/v1';
  const path = 'something/:id';

  const template = UrlSubst(base, path);

  t.is(typeof template, 'function');
  t.deepEqual(template.params, ['id']);

  const result = template({ id: 123 });

  t.is(result, 'https://example.com:1234/v1/something/123');

});


test('missing param', t => {

  const template = UrlSubst('https://example.com', 'a/:id');

  const fn = () => template({ });

  t.throws(fn, "Missing URL parameter 'id'");

});

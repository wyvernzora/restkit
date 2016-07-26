# ![restkit-logo][logo]

> Tool kit for rapid development of REST API bindings.

[ ![CodeshipCI][ci0] ][ci1]

Ever tried to integrate with a RESTful API, only to find out there are no client libraries on `npm`?
RESTkit is here to help.

RESTkit attempts to provide a minimalistic framework for creating RESTful API clients, where you only
need to worry about service-specific logic, while all plumbing and stuff is taken care of for you.


# Getting Started
```sh
$ npm install rest-kit --save
```
```js
const RestKit = require('rest-kit');
```


Creating an API binding library is as easy as supplying a few bits of information
to the RestKit.

```js

RestKit({
  root: 'https://api.example.com/v1'
}, {
  auth: RestKit.Resource({ ... })
});
```

# RestKit.Endpoint()

An *endpoint* is a single method exposed by the REST API. For example, `DELETE /record/:id` is
an endpoint. Endpoints are created using `RestKit.Endpoint` function, though normally you wouldn't
need to do that yourself.

```js
const endpoint = RestKit.Endpoint(config, spec);
```

Every endpoint is described by an object that lets RESTkit know how to call it. Following are
properties supported by `RestKit.Endpoint`.

## path
Required.

Path portion of the API URL, in addition to the API root specified in `config` during instantiation.
`path` is **joined** to the API root url, therefore the preceding slash is ignored, and relative
paths will not work.

```js
RestKit.Endpoint(config, {
  path: '/records'
});
```


## method
Optional, default value: `GET`.

Specifies the HTTP method that should be used when calling the endpoint.

```js
RestKit.Endpoint(config, {
  path: '/records',
  method: 'POST'
});
```


## query
Optional, default value: `{ }`

Specifies mapping from parameters to query parameters. RESTkit endpoints do not make distinction
between URL parameters, query parameters and request body. Everything is handled for the user.
Listing query parameters here lets RESTkit know that these parameters are meant for query string.

```js
RestKit.Endpoint(config, {
  path: '/records',
  query: {
    id: 'record_id'
  }
});
```

The reason it's an object rather than array is because query parameter names can be long and using
notation incompatible with the project styling. Providing a mapping would allow users to use shorter
parameter names. In the example above, if user calls `records({ id: 'foo' })`, the URL will eventually
become `/records?record_id=foo`.

If you only need to specify query parameters, but choose not to use name mapping, you can always
pass in an array, and it will be expanded into appropriate mapping.

```js
RestKit.Endpoint(config, {
  path: '/records',
  query: ['record_id']
});
```


## params
Optional, default value: `[ ]`

Specifies required parameters that are accepted as function arguments. All parameters specified here
are required, and omitting them will trigger an error.

```js
RestKit.Endpoint(config, {
  path: '/records',
  params: ['id']
});

records(123);
```

Of course, parameters that are listed in `query` can also be listed here.


## pre
Optional, default value: `(req) => { }`

Provides a function hook that is executed *before* sending the request, but *after* all parameters
are processed and defaults are applied. The function accepts a single argument `req`, which is the
request data with all headers and parameters (see `request-promise` for more).

```js
RestKit.Endpoint(config, {
  path: '/records',
  pre: (req) => { req.headers['User-Agent'] = 'RESTkit/1.0'; }
});
```


## post
Optional, default value: `(res) => { }`

Provides a function hook that is executed *after* receiving the response. The function accepts a
single argument `res`, which is the *complete response* received from `request-promise`. This is
your opportunity to modify response body before it is returned from the endpoint function.

```js
RestKit.Endpoint(config, {
  path: '/records',
  pre: (req) => { req.headers['User-Agent'] = 'RESTkit/1.0'; }
});
```


## error
Optional, default value: `(err, res) => { }`

Provides a function hook that is executed when there is an error. The function accepts two arguments.
`err` is the Error object caught during HTTP call, and `res` is the response object. This is your
opportunity to throw another error. If you don't, the original error will be thrown.

It is **impossible** to silence the error.

```js
RestKit.Endpoint(config, {
  path: '/records',
  error: (err, res) => { throw new Error(`OOPS: ${res.body.message}`); }
});
```


# RestKit.Resource()

A *resource* is a group of API endpoints that serve related purposes. You can think of them
as of directories, whereas in the API library they will be grouped under the same property.

For example:
```js
const auth = {
  login: {
    method: 'POST',
    path: '/auth',
    params: [ 'username', 'password' ]
  },
  logout: {
    method: 'DELETE',
    path: '/auth'
  }
};

const api = RestKit({
  root: 'https://api.example.com/v1'
}, {
  auth: RestKit.Resource(auth)
})
```

The keys of the resource object will become function names, while values are objects describing
corresponding endpoints (see *Describing Endpoints* for more).
You can then call the API endpoints you just described like this:

```js
const client = api();

await client.auth.login('user', 'password');
await client.auth.logout();
```


# RestKit()

Once you have all your resources ready to go, you can export the API client factory by simply
calling `RestKit` and providing a few pieces configuration. For example:

```js
module.exports = RestKit({
  root: 'https://api.example.com/v1'
}, {
  required: ['token']
}, {
  auth: RestKit.Resource(auth)
})
```

There are additional options available for more advanced configuration of RESTkit. `RESTkit`
accepts three arguments, which are the following:

## defaults
Required.

Specifies default configuration values that can be overwritten by the user. Since you can access
the `config` value from various hooks, you can put anything here.

### defaults.root
Required.

This value specifies the root URI of the API.


### defaults.headers
Optional, default value: `{ }`

Specifies a hash of headers that are applied to every API call. Note that if user specifies
`config.headers` during API client creation, this value will be overwritten.


### defaults.params
Optional, default value: `{ }`

Specifies URL parameters that are applied to every API call. Note that if user specifies
`config.params` during API client creation, this value will be overwritten.


### defaults.query
Optional, default value: `{ }`

Specifies query parameters that are applied to every API call. Note that if user specifies
`config.query` during API client creation, this value will be overwritten.


### defaults.body
Optional, default value: `{ }`

Specifies request body parameters that are applied to every API call. Note that if user specifies
`config.body` during API client creation, this value will be overwritten.


##

## More Examples

### Passing API token in Authorization header
```js
const RestKit = require('rest-kit');


const api = RestKit({
  root: 'https://api.example.com/v1',
  headers: { }
}, {
  required: ['token'],
  oncreate() {
    this.config$.headers.Authorization = `token ${this.config$.token}`;
  }
}, {
  auth: RestKit.Resource({
    login: {
      method: 'POST',
      path: '/auth',
      params: [ 'username', 'password' ]
    },
    logout: {
      method: 'DELETE',
      path: '/auth'
    }
  })
});

const client = api({ token: 'foobarbaz' });

await client.auth.login('user', '12345');

```


[logo]: media/rest-kit.png
[ci0]: https://img.shields.io/codeship/c7d26830-3469-0134-f8ac-3e455aee75aa.svg?maxAge=2592000?style=flat-square
[ci1]: https://codeship.com/projects/164938

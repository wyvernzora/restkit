# ![restkit-logo][logo]

> Tool kit for rapid development of REST API bindings.

[ ![CodeshipCI][ci0] ][ci1]

Ever tried to integrate with a RESTful API, only to find out there are no client libraries on `npm`?
RESTkit is here to help.

RESTkit attempts to provide a minimalistic framework for creating RESTful API clients, where you only
need to worry about service-specific logic, while all plumbing and stuff is taken care of for you.


## Getting Started
```sh
$ npm install restkit --save
```

Then, in any JS file:
```js
const RestKit = require('restkit');

module.exports = RestKit({
  root: 'https://api.example.com/v1',
  headers: { }
}, {
  auth: RestKit.Resource({
    login: {
      method: 'POST',
      path: '/auth'
    }
  })
});
```

## Documentation

### `RestKit(defaults, [options,] resources)`
`RestKit` function generates a factory function for API binding instances.

#### `defaults.root`
*Required* Specifies the default API root URI. Unless overridden during instance creation,
all API calls are by default based on this URI.

#### `defaults.headers`
*Optional* A hash of headers to include with every request. For example, a good fit here would be
`User-Agent` header.

#### `options.required`
*optional* An array of configuration parameters that are required during instance creation.
For example, if the API requires an authentication token, which is expected in the `token`
property, then specifying `options.required` as `[ 'token' ]` would make sure the user supplies
a token when creating API client.

#### `options.oncreate`
*optional* A function that is called on creation of every instance. The function receives one
argument, which is the API client instance that is being created. Function context is also the
client instance.

#### `resources`
*optional* A hash of resource names to Resource objects that represent the RESTful API.

### `RestKit.Resource(spec, [children])`
`RestKit.Resource` is a group of API calls that are organized together. For example, the login and
logout actions can be organized into an `auth` resource. This function generates a factory function, which takes specific configuration provided during instantiation.

#### `spec`
*required* A JavaScript object describing the resource and endpoints it contains. Keys are method
names, values are converted into `RestKit.Endpoint` objects.

#### `children`
*optional* Sub-resources that should be attached to current one. For example, user profile and
business profile resources can be organized as `user.profile` and `business.profile`.

### `RestKit.Endpoint(config, spec)`
`RestKit.Endpont` represents one single RESTful action, and returns an async function that calls
the specified endpoint.

#### `config`
The configuration object passed down by the user.

#### `spec.path`
*required* The path of the API endpoint. The preceding slash `/` is ignored. May contain
placeholders in the format of `:identifier`, which are interpolated from arguments when called.

#### `params`
*optional* An array of parameters that are required, and are supplied by called as function
arguments in the order.

#### `query`
*optional* A mapping of argument properties to respective query parameters. Properties listed
here are removed from request body.

#### `method`
*optional* HTTP method used for calling the API endpoint. Default value is `GET`.

#### `pre`, `post`, `error`
*optional* Funcions or arrays of functions that are called before and after request, and when
there is an error. The context of these functions exposes a `config$` property which can be
used for modifying global configuration.


## More Examples

### Passing API token in Authorization header
```js
const RestKit = require('restkit');


const api = RestKit({
  root: 'https://api.example.com/v1',
  headers: { }
}, {
  required: ['token'],
  oncreate: function() {
    this.config$.headers.Authorization = `token ${this.config$.token}`;
  }
}, {
  auth: RestKit.Resource({
    login: {
      method: 'POST',
      path: '/auth',
      params: [ 'username', 'password' ]
    }
  })
});

const client = api({ token: 'foobarbaz' });

await client.auth.login('user', '12345');

```


[logo]: media/rest-kit.png
[ci0]: https://img.shields.io/codeship/c7d26830-3469-0134-f8ac-3e455aee75aa.svg?maxAge=2592000?style=flat-square
[ci1]: https://codeship.com/projects/164938

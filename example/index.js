/**
 * example/index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const RestKit      = require('..');


module.exports = RestKit({
  root: 'https://echo.getpostman.com',
  headers: { }
}, {
  auth:            RestKit.Resource(require('./resources/auth')),
  headers:         RestKit.Resource(require('./resources/headers')),
  methods:         RestKit.Resource(require('./resources/methods')),
  utilities:       RestKit.Resource(require('./resources/utilities'))
});

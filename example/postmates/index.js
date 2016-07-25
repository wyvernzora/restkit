/**
 * index.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const RestKit      = require('../..');


module.exports = RestKit({

  root:            'https://api.postmates.com/v1/'

}, {

  required:        [ 'customer', 'key' ],
  oncreate:        require('./hooks/oncreate'),
  pre:             require('./hooks/pre')

}, {

  delivery:        RestKit.Resource(require('./resources/delivery')),
  quote:           RestKit.Resource(require('./resources/quote')),
  zone:            RestKit.Resource(require('./resources/zone'))

});

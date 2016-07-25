/**
 * resources/headers.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */


module.exports = {

  request: {
    path: '/headers'
  },

  response: {
    path: '/response-headers',
    query: {
      contentType: 'Content-Type'
    },
    params: ['contentType']
  }

};

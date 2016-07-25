/**
 * example/resources/methods.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */


module.exports = {

  get: {
    path: '/get',
    query: ['test']
  },

  post: {
    method: 'POST',
    path: '/post'
  },

  put: {
    method: 'PUT',
    path: '/put'
  },

  patch: {
    method: 'PATCH',
    path: '/patch'
  },

  delete: {
    method: 'DELETE',
    path: '/delete'
  }

};

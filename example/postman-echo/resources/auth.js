/**
 * resources/auth.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */


module.exports = {

  basic: {
    method: 'GET',
    path: '/basic-auth',
    params: [ 'username', 'password' ],
    pre(req) {
      const encoded = new Buffer(`${req.body.username}:${req.body.password}`).toString('base64');
      req.headers.Authorization = `basic ${encoded}`;

      delete req.body.username;
      delete req.body.password;
    }
  }

};

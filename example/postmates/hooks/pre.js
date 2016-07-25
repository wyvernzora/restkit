/**
 * hooks/pre.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */


function pre(req) {

  /**
   * Make sure stuff is sent as form-data
   */
  req.form = req.body;
  delete req.body;

}
module.exports = pre;

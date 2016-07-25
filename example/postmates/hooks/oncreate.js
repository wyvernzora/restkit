/**
 * hooks/oncreate.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */


function oncreate(api) {

  const encoded = new Buffer(`${api.config$.key}:`).toString('base64');
  api.config$.headers.Authorization = `Basic ${encoded}`;

  api.config$.params.customer = api.config$.customer;

}
module.exports = oncreate;

/**
 * resources/quote.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

module.exports = {


  /**
   * https://postmates.com/developer/docs/endpoints#get_quote
   */
  get: {
    method: 'POST',
    path: '/customers/:customer/delivery_quotes'
  }

};

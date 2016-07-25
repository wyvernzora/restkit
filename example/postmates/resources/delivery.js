/**
 * resources/delivery.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */

module.exports = {

  /**
   * https://postmates.com/developer/docs/endpoints#create_delivery
   */
  create: {
    method: 'POST',
    path: '/customers/:customer/deliveries',
    required: ['quote_id']
  },


  /**
   * https://postmates.com/developer/docs/endpoints#list_deliveries
   */
  list: {
    method: 'GET',
    path: '/customers/:customer/deliveries',
    query: ['filter']
  },


  /**
   * https://postmates.com/developer/docs/endpoints#get_delivery
   */
  get: {
    method: 'GET',
    path: '/customers/:customer/deliveries/:id',
    params: ['id']
  },


  /**
   * https://postmates.com/developer/docs/endpoints#cancel_delivery
   */
  cancel: {
    method: 'POST',
    path: '/customers/:customer/deliveries/:id/cancel',
    params: ['id']
  },


  /**
   * https://postmates.com/developer/docs/endpoints#return_delivery
   */
  return: {
    method: 'POST',
    path: '/customers/:customer/deliveries/:id/return',
    params: ['id']
  },


  /**
   * https://postmates.com/developer/docs/endpoints#tip_delivery
   */
  tip: {
    method: 'POST',
    path: '/customers/:customer/deliveries/:id',
    params: [ 'id', 'tip_by_customer' ]
  }

};

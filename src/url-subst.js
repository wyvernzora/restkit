/**
 * util/url-subst.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
const Url          = require('url');
const Path         = require('path');


function urlSubst(root, path) {

  /**
   * Make the template
   */
  const parsed = Url.parse(root);
  const template = Path.join(parsed.pathname, path);


  /**
   * Substitution function
   */
  const fn = params => {

    const substituted = template
      .replace(/:([_a-zA-Z][_a-zA-Z0-9]+)/g, key => {

        /* Remove the ':' prefix */
        key = key.substr(1);

        /* Attempt to substitute, throw if not found */
        const value = params[key];
        if (!value) {
          throw new Error(`Missing URL parameter '${key}'`);
        }

        return value;
      });

    return Url.format({
      host: parsed.host,
      protocol: parsed.protocol,
      pathname: substituted
    });

  };


  /**
   * Find all URL parameters in the path
   */
  fn.params = [ ];
  const pattern = /:([_a-zA-Z][_a-zA-Z0-9]+)/g;
  let match = pattern.exec(template);
  while (match) {
    fn.params.push(match[0].substr(1));
    match = pattern.exec(template);
  }


  return fn;
}
module.exports = urlSubst;

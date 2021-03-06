var request = require('request');
var cheerio = require('cheerio');
module.exports = getOGP;

function getOGP(url, callback) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var result = {};
      var tag = cheerio.load(body)('meta');
      var keys = Object.keys(tag)
      keys.forEach(function(key){  
        if (tag[key].attribs && tag[key].attribs.property
            && tag[key].attribs.property.indexOf('og') != -1) {
          var og = tag[key].attribs.property.split(':');
          og.shift();
          var content = tag[key].attribs.content
          if (og.length == 1) {
            result[og] = content
          }
          else if (og.length == 2) {
            if (result[og[0]]) {
              if (typeof result[og[0]] == 'string') {
                var tempURL = result[og[0]]
                result[og[0]] = {}
                result[og[0]]['url'] = tempURL
                result[og[0]][og[1]] = content
              }
              else {
                result[og[0]][og[1]] = content
              }
            }
          }
        }
      })
      callback(result);
    }
  })
}



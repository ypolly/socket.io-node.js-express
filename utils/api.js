
function apiRequest(search, callback ) {
    return new Promise((resolve, reject) => {
        apiKey = 'LHl2ihx2MP8vil24i9xHN0X0hsBSRkbr';
        var request = require('request');
      request.get({
        url: 'http://api.giphy.com/v1/gifs/search?q='+search+'&api_key='+apiKey+'&limit=1&offset=0&rating=g&lang=en',
        json: true,
        headers: {'User-Agent': 'request'}
      }, (err, res, data) => {
        if (err) {
          reject(err);
        } else if (res.statusCode !== 200) {
          reject(res.statusCode);
        } else {
          resolve(data);
        }
      });
    })//.then(data => console.log('Data:', data))
    // .catch(err => console.log('Error:', err));
  
  }
  


module.exports = apiRequest;
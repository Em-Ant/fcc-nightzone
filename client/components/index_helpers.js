var ajax = new (require('../js/ajax-functions.js'));
var appUrl = window.location.origin;

function _mapBars(data) {
  data = JSON.parse(data);
  var businesses = data.businesses;
  if (businesses) {
    var bars = businesses.map(function(bar){
      var out = {};
      out.name = bar.name;
      out.url = bar.url;
      out.barId = bar.id;
      out.address = bar.location.address.filter(function(el){
        if(el !== ', ') return true;
        return false;
      }).join(', ')
        + ' - ' + bar.location.city;
      out.snippet = bar.snippet_text ? bar.snippet_text : undefined;
      out.imageUrl = bar.image_url ? bar.image_url : undefined;
      out.nGoing = bar.nGoing ? bar.nGoing : undefined;
      out.amIGoing = bar.amIGoing ? bar.amIGoing : undefined;
      return out;
    });
  }

  return bars || [];
};

module.exports = {


  searchAuth: function (cb, loc) {
    ajax.ajaxRequest('post', appUrl + '/api/search', function(data){
      var bars = _mapBars(data);
      cb(bars);
    }, null, {location: loc || 'last'});
  },

 search: function(cb, loc) {
    ajax.ajaxRequest('get', appUrl + '/api/search/' + loc, function(data){
      var bars = _mapBars(data);
      cb(bars);
    });
  },

  addMe: function(cb, id) {
    ajax.ajaxRequest('post', appUrl + '/api/addme', function(data){
      data = JSON.parse(data)
      cb(data);
    }, null, {barId: id});
  },

  removeMe: function(cb, id) {
    ajax.ajaxRequest('post', appUrl + '/api/removeme', function(data){
      data = JSON.parse(data)
      cb(data);
    }, null, {barId: id});
  },

  copy: function(obj) {
    // WARNING: first level copy ONLY !!!
    // For nested objects use lodash or Object.assing();
    var newObj = {};
    for ( k in obj) {
      newObj[k] = obj[k];
    }
    return newObj;
  }
}

'use strict';

function AjaxFunctions() {
   this.ready = function (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   };

   this.ajaxRequest = function (method, url, callback, params) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      if (params) {
        var query = [];
        for (var key in params) {
          query.push(key + '=' + encodeURIComponent(params[key]));
          query.push('&');
        }
        query.pop();
        query = query.join('');
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(query);
      } else {
        xmlhttp.send();
      }

   };
};

module.exports = AjaxFunctions;

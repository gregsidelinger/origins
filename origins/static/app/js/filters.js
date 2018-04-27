'use strict';

/* Filters */

angular.module('filters', []);


angular.module('filters')
  .filter('strtruncate', function () {
        return function (value, wordwise, max, tail, end) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;
            if (end) {
              value = value.slice(-max)
            } else {
              value = value.substr(0, max);
            }

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }
            if (end) {
            return  (tail || '… ') + value;
            } else {
            return value + (tail || ' …');
            }

        };
    });


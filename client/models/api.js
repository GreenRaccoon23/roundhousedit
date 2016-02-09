var api = {
  url: 'http://api.icndb.com',

  fetch: function(location) {
    return m.request({
      'method': 'GET',
      'url': api.url + '/jokes' + location
    });
  },

  fetchCategories: function() {
    return m.request({
      'method': 'GET',
      'url': api.url + '/categories'
    });
  },

  fetchTotal: function() {
    return api.fetch('/count');
  },

  fetchAll: function() {
    return api.fetch('');
  },

  fetchCategory: function(category) {
    return api.fetch('?limitTo=[' + category + ']');
  },

  fetchCategoryRandom: function(category) {
    return api.fetch('/random/?limitTo=[' + category + ']');
  },

  fetchSpecific: function(id) {
    return api.fetch('/' + id);
  }

};
Array.prototype.matches = function(other) {
  if (this.length !== other.length) {
    return false;
  }
  for (var i = 0, len = this.length; i < len; i++) {
    if (Array.isArray(this[i]) && !this[i].matches(other[i])) {
      return false;
    } else if (this[i] !== other[i]) {
      return false;
    }
  }
  return true;
}

var JokeWidgetSeries = {
  controller: function() {
    var ctrl = this;
    window.category = 'all';
    window.categoryList = ['all'];
    ctrl.category = window.category;
    ctrl.jokes = [{
      categories: ['nerdy'],
      id: 598,
      joke: "Chuck Norris is the reason Waldo is hiding.",
      votes: 3,
      favorite: false,
      vote: ''
    }, {
      categories: ['nerdy'],
      id: 599,
      joke: "Chuck Norris can slam a revolving door.",
      votes: 2,
      favorite: false,
      vote: ''
    }, {
      categories: ['nerdy'],
      id: 600,
      joke: "Chuck Norris can make a Happy Meal cry.",
      votes: 1,
      favorite: false,
      vote: ''
    }]

    ctrl.fetchCategories = function() {
      api.fetchCategories()
        .then(function(res) {
          ctrl.categories = res.value;
          window.categoryList = window.categoryList.concat(res.value);
        });
    };

    ctrl.fetchTotal = function() {
      api.fetchTotal()
        .then(function(res) {
          ctrl.total = res.value;
        });
    };

    ctrl.fetchAll = function() {
      var now = performance.now();
      api.fetchAll()
        .then(function(res) {
          console.log('Received all', res.value.length, 'jokes from API');
          ctrl.filterResponse(res);
        });
    };

    ctrl.fetchCategory = function(category) {
      api.fetchCategory(category)
        .then(function(res) {
          console.log('Received', res.value.length, category, 'jokes from API');
          ctrl.filterResponse(res);
        });
    };

    ctrl.filterResponse = function(res) {
      res.value.forEach(function(joke, i) {
        var skip = window.filters.reduce(function(skip, re) {
          return (skip) ? skip : re.test(joke.joke);
        }, false);
        if (skip) {
          return;
        }
        joke.votes = joke.votes || 0;
        joke.favorite = joke.favorite || false;
        joke.vote = joke.vote || '';
        joke.joke = joke.joke.replace(/\&quot\;/g, '"');

        ctrl.jokes.push(joke);
      });
    };

    ctrl.watchCategory = function() {
      if (window.category !== ctrl.category) {
        ctrl.category = window.category;
        if (ctrl.category === 'all') {
          ctrl.fetchAll();
        } else {
          ctrl.fetchCategory(ctrl.category);
        }
      }
      setTimeout(ctrl.watchCategory, 100);
    };

    ctrl.fetchCategories();
    ctrl.fetchTotal();
    ctrl.fetchAll();

    // ctrl.watchCategory();
    // ctrl.watchingCategory = setInterval(ctrl.watchCategory, 500);
  },
  view: function(ctrl) {
    return m('#jokes-container',
      m('#jokes',
        ctrl.jokes.sort(function(a, b) {
          return (a.votes < b.votes) ? 1 : (a.votes > b.votes) ? -1 : 0;
        }).map(function(joke) {
          var isCorrectCategory = (
            (window.category === 'all') || 
            (joke.categories.indexOf(window.category) !== -1)
          );
          return ( ! isCorrectCategory )
            ? ''
            : m.component(JokeWidget, joke);
        })
      )
    );
  }
}

var JokeWidget = {
  view: function(ctrl, joke) {
    return m('.joke', [
        m('.joke-vote-container', [
          m.component(ThumbUpIcon, joke),
          m.component(ThumbDownIcon, joke),
          m('.joke-vote-count', joke.votes)
        ]),
        m('.joke-text-container', [
          m('.joke-text', {
            class: (joke.favorite) ? 'favorite' : ''
          }, joke.joke)
        ]),
        m.component(StarIcon, joke)
      ]
    );
  }
}

var ThumbUpIcon = {
  view: function(ctrl, joke) {
    return m('.thumb-up', {
        class: (joke.vote === 'up') ? 'voted-up' : '',
        onclick: function(e) {
          if (joke.vote === 'up') {
            return;
          }
          joke.votes += 1;
          joke.vote = (joke.vote === 'down') ? '' : 'up';
        }
      }, m('svg[viewBox="0 0 48 48"]', [
          m('path[class="voter vote-up"]', {
            d: 'M2 42h8V18H2v24zm44-22c0-2.21-1.79-4-4-4H29.37l1.91-9.14c.04-.2.07-.41.07-.63 0-.83-.34-1.58-.88-2.12L28.34 2 15.17 15.17C14.45 15.9 14 16.9 14 18v20c0 2.21 1.79 4 4 4h18c1.66 0 3.08-1.01 3.68-2.44l6.03-14.1c.18-.46.29-.95.29-1.46v-3.83l-.02-.02L46 20z'
          })
        ])
      );
  }
}

var ThumbDownIcon = {
  view: function(ctrl, joke) {
    return m('.thumb-down', {
        class: (joke.vote === 'down') ? 'voted-down' : '',
        onclick: function(e) {
          if (joke.vote === 'down') {
            return;
          }
          joke.votes -= 1;
          joke.vote = (joke.vote === 'up') ? '' : 'down';
        }
      }, m('svg[viewBox="0 0 48 48"]', [
          m('path[class="voter vote-down"]', {
            d: 'M30 6H12c-1.66 0-3.08 1.01-3.68 2.44l-6.03 14.1C2.11 23 2 23.49 2 24v3.83l.02.02L2 28c0 2.21 1.79 4 4 4h12.63l-1.91 9.14c-.04.2-.07.41-.07.63 0 .83.34 1.58.88 2.12L19.66 46l13.17-13.17C33.55 32.1 34 31.1 34 30V10c0-2.21-1.79-4-4-4zm8 0v24h8V6h-8z'
          })
        ])
      );
  }
}

var StarIcon = {
  view: function(ctrl, joke) {
    return m('.star', {
        class: (joke.favorite) ? 'starred' : 'unstarred',
        onclick: function(e) {
          joke.favorite = (joke.favorite) ? false : true;
          m.redraw('diff');
        }
      }, m('svg[viewBox="0 0 24 24"]', [
          m('path', {
            d: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
          })
        ])
      );
  }
}

var filters = [/condom/, /virgin/, /testicle/, /sex/]

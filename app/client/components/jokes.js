Array.prototype.matches = function(other) {
  if (this.length !== other.length) {
    return false;
  }
  for (var i = 0, len = this.length; i < len; i++) {
    if (Array.isArray(this[i])) {
      console.log('Going down');
    }

    if (Array.isArray(this[i]) && !this[i].matches(other[i])) {
      return false;
    } else if (this[i] !== other[i]) {
      // console.log('false');
      console.log('this[i]', this[i]);
      console.log('other[i]', other[i]);
      return false;
    }
  }
  return true;
}

var jokes = {
  controller: function() {
    var ctrl = this;
    window.category = 'all';
    window.categoryList = ['all'];
    window.jokeList = [];
    ctrl.category = window.category;
    // ctrl.jokes = [];
    ctrl.jokes = [{
      categories: [],
      id: 2,
      joke: "MacGyver can build an airplane out of gum and paper clips. Chuck Norris can kill him and take it.",
      votes: 2
    },
    {
      categories: [],
      id: 2,
      joke: "Second MacGyver can build an airplane out of gum and paper clips. Chuck Norris can kill him and take it.",
      votes: 1
    }]

    ctrl.fetchCategories = function() {
      api.fetchCategories()
        .then(function(response) {
          // console.log('response', response);
          ctrl.categories = response.value;
          console.log('categoryList', window.categoryList);
          window.categoryList = window.categoryList.concat(response.value);
          console.log('categoryList', window.categoryList);
        });
    };

    ctrl.fetchTotal = function() {
      api.fetchTotal()
        .then(function(response) {
          // console.log('response', response);
          ctrl.total = response.value;
        });
    };

    ctrl.fetchAll = function() {
      api.fetchAll()
        .then(function(response) {
          console.log('Received response');
          // console.log('response', response);
          ctrl.filterResponse(response);
        });
    };

    ctrl.fetchCategory = function() {
      api.fetchCategory(ctrl.category)
        .then(function(response) {
          // console.log('response', response);
          ctrl.filterResponse(response);
        });
    };

    ctrl.filterResponse = function(response) {
      response.value.forEach(function(joke) {
        var skip = window.filters.reduce(function(skip, re) {
          return (skip) ? skip : re.test(joke.joke);
        }, false)
        if (!skip) {
          joke.votes = joke.votes || 0;
          joke.favorite = joke.favorite || false;
          joke.vote = joke.vote || '';
          joke.joke = joke.joke.replace(/\&quot\;/g, '"');

          ctrl.jokes.push(joke);
        }
      })
      console.log('Filtered response');
      ctrl.sortJokes();
      window.jokeList = ctrl.jokes;
      console.log('Sorted response');
    };

    ctrl.sortJokesOld = function() {
      for (var i = 0, len = ctrl.jokes.length - 1; i < len; i++) {
        var currJoke = ctrl.jokes[i];
        var nextJoke = ctrl.jokes[i + 1];
        if (nextJoke.votes > currJoke.votes) {
          for (var p in currJoke) {
            var currP = currJoke[p];
            var nextP = nextJoke[p];
            currJoke[p] = nextP;
            nextJoke[p] = currP;
          }
          m.redraw('diff');
        }
      }
      setTimeout(ctrl.sortJokes, 1);
    };

    ctrl.sortJokes = function() {
      for (var i = 0, len = ctrl.jokes.length - 1; i < len; i++) {
        var currJoke = ctrl.jokes[i];
        for (var j = i + 1; j < len; j++) {
          var nextJoke = ctrl.jokes[j];
          if (nextJoke.votes > currJoke.votes) {
            for (var p in currJoke) {
              var currP = currJoke[p];
              var nextP = nextJoke[p];
              currJoke[p] = nextP;
              nextJoke[p] = currP;
            }
            m.redraw('diff');
          }
        }
      }
      setTimeout(ctrl.sortJokes, 1);
    };

    ctrl.watchCategory = function() {
      if (window.category !== ctrl.category) {
        ctrl.category = window.category;
        if (ctrl.category !== 'all') {
          ctrl.fetchAll();
        } else {
          ctrl.fetchCategory(ctrl.category);
        }
      }
    };

    ctrl.fetchCategories();
    ctrl.fetchTotal();
    ctrl.fetchAll();

    ctrl.watchingCategory = setInterval(ctrl.watchCategory, 500);
  },
  view: function(ctrl) {
    return m('#jokes-container',
      m('#jokes',
        window.jokeList.map(function(jokeObj) {
          var correctCategory = (jokeObj.categories.indexOf(window.category) !== -1);
          return (window.category === 'all' || correctCategory)
            ? m.component(joke, { jokeObj: jokeObj })
            : ''
        })
      )
    );
  }
}

var joke = {
  controller: function(inherited) {
    var ctrl = this;
    ctrl.jokeObj = inherited.jokeObj;
    ctrl.favorite = m.prop(false);
  },
  view: function(ctrl) {
    return m('.joke', {
        class: ctrl.favorite() ? 'favorite' : ''
      }, [
        m('.thumb-container', [
          m.component(thumbUpIcon, ctrl.jokeObj),
          m.component(thumbDownIcon, ctrl.jokeObj),
          m('.joke-vote', ctrl.jokeObj.votes)
        ]),
        m('.joke-text-container', [
          m('.joke-text', ctrl.jokeObj.joke)
        ]),
        m.component(starIcon, ctrl.jokeObj)
      ]
    );
  }
}

var thumbUpIcon = {
  controller: function(inherited) {
    var ctrl = this;
    ctrl.jokeObj = inherited;
  },
  view: function(ctrl) {
    return m('.thumbUp', {
        class: (ctrl.jokeObj.vote === 'up') ? 'voted-up' : '',
        onclick: function(e) {
          if (ctrl.jokeObj.vote !== '') {
            return;
          }
          ctrl.jokeObj.votes += 1;
          ctrl.jokeObj.vote = 'up';
        }
      }, m('svg[viewBox="0 0 48 48"]', [
          m('path', {
            d: 'M2 42h8V18H2v24zm44-22c0-2.21-1.79-4-4-4H29.37l1.91-9.14c.04-.2.07-.41.07-.63 0-.83-.34-1.58-.88-2.12L28.34 2 15.17 15.17C14.45 15.9 14 16.9 14 18v20c0 2.21 1.79 4 4 4h18c1.66 0 3.08-1.01 3.68-2.44l6.03-14.1c.18-.46.29-.95.29-1.46v-3.83l-.02-.02L46 20z'
          })
        ])
      );
  }
}

var thumbDownIcon = {
  controller: function(inherited) {
    var ctrl = this;
    ctrl.jokeObj = inherited;
  },
  view: function(ctrl) {
    return m('.thumbDown', {
        class: (ctrl.jokeObj.vote === 'down') ? 'voted-down' : '',
        onclick: function(e) {
          if (ctrl.jokeObj.vote !== '') {
            return;
          }
          ctrl.jokeObj.votes -= 1;
          ctrl.jokeObj.vote = 'down';
        }
      }, m('svg[viewBox="0 0 48 48"]', [
          m('path', {
            d: 'M30 6H12c-1.66 0-3.08 1.01-3.68 2.44l-6.03 14.1C2.11 23 2 23.49 2 24v3.83l.02.02L2 28c0 2.21 1.79 4 4 4h12.63l-1.91 9.14c-.04.2-.07.41-.07.63 0 .83.34 1.58.88 2.12L19.66 46l13.17-13.17C33.55 32.1 34 31.1 34 30V10c0-2.21-1.79-4-4-4zm8 0v24h8V6h-8z'
          })
        ])
      );
  }
}

var starIcon = {
  controller: function(inherited) {
    var ctrl = this;
    ctrl.jokeObj = inherited;
  },
  view: function(ctrl) {
    return m('.star', {
        class: (ctrl.jokeObj.favorite) ? 'starred' : 'unstarred',
        onclick: function(e) {
          if (ctrl.jokeObj.favorite) {
            ctrl.jokeObj.favorite = false;
          } else {
            ctrl.jokeObj.favorite = true;
          }
        }
      }, m('svg[viewBox="0 0 24 24"]', [
          m('path', {
            d: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
          })
        ])
      );
  }
}

function sortJokes(ctrl) {
  var sorted = [];
  var added = {};

  for (var i = 0, len = ctrl.jokes.length; i < len; i++) {
    var jokeToAdd = ctrl.jokes.reduce(function(jokeToAdd, joke) {
      if (added[jokeToAdd.joke]) {
        return joke;
      } else if (added[joke.joke]) {
        return jokeToAdd;
      }
      return (joke.votes > jokeToAdd.votes)
        ? joke
        : jokeToAdd;
    }, ctrl.jokes[0]);
    added[jokeToAdd.joke] = true;
    sorted.push(jokeToAdd);
  }
  ctrl.jokes = sorted;
  return sorted;
}

var copyIcon = {
  controller: function() {
    var ctrl = this;
  },
  view: function(ctrl) {
    return m('.copy', {
        onclick: function(e) {
          ctrl.favorite(false);
        }
      }, m('svg[viewBox="0 0 48 48"]', [
          m('path', {
            d: 'M32 2H8C5.79 2 4 3.79 4 6v28h4V6h24V2zm6 8H16c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h22c2.21 0 4-1.79 4-4V14c0-2.21-1.79-4-4-4zm0 32H16V14h22v28z'
          })
        ])
      );
  }
}

var filters = [/condom/, /virgin/, /testicles/]
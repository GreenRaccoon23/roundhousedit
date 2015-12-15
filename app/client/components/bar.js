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

var bar = {
  controller: function() {
    var ctrl = this;
  },
  view: function(ctrl) {
    return m('#bar', [
        m.component(menu)
      ]
    );
  }
}

var menu = {
  controller: function() {
    var ctrl = this;
    ctrl.showMenu = m.prop(false);
  },
  view: function(ctrl) {
    return m('#menu',
        m.component(hoverable, {
          hover: ctrl.showMenu,
          delay: 100
        // }, menuElements(ctrl)
        }, [m.component(categories, { showMenu: ctrl.showMenu })]
      )
    )
  }
}

var categories = {
  controller: function(inherited) {
    var ctrl = this;
    ctrl.showMenu = inherited.showMenu;
  },
  view: function(ctrl) {
    return (ctrl.showMenu() && window.categoryList.length)
      ? expandedCategories()
      : collapsedCategories();
  }
}

function expandedCategories() {
  return m('.menu', 'Categories',
    window.categoryList.map(function(c) {
      return m('.category', {
        class: c.category,
        onclick: function() {
          window.category = c.category;
        }
      }, c);
    })
  );
}

function collapsedCategories() {
  return m('.menu', 'Categories', []);
}

// function menuElements(ctrl) {
//   return (!ctrl.showMenu())
//     ? m('.menu', 'Menu')
//     : [
//         m('.menu', 'Menu'),
//         m('.menu', 'hi')
//     ];
// }

// https://www.snip2code.com/Snippet/532936/How-to-capture--hover-intent--with-Mithr
var hoverable = {
  controller : function( args ){
    var timer
    
    this.mouseover = function(){
      m.redraw.strategy( 'none' )
      
      clearTimeout( timer )
      
      timer = setTimeout( function(){
        args.hover( true )
        
        m.redraw.strategy( 'diff' )
        
        m.redraw()
      }, args.delay || 100 )
    }
    
    this.mouseout = function(){
      m.redraw.strategy( 'none' )
      
      clearTimeout( timer )
      
      timer = setTimeout( function(){
        args.hover( false )
        
        m.redraw.strategy( 'diff' )
        
        m.redraw()
      }, args.delay || 100 )
    }
  },
  view : function( ctrl, args, contents ){
    return m( '.hoverable', {
      onmouseover : ctrl.mouseover,
      onmouseout  : ctrl.mouseout
    }, 
      [].slice.call( arguments, 2 )
    )
  }
}

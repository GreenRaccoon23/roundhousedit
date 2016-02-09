var bar = {
  controller: function() {
    var ctrl = this;
  },
  view: function(ctrl) {
    return m('#bar', [
        m('h1[id="title"]', 'Roundhousedit'),
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
  return m('#categories', 'Categories',
    window.categoryList.map(function(c) {
      return m('.category', {
        class: c,
        onclick: function() {
          window.category = c;
        }
      }, c);
    })
  );
}

function collapsedCategories() {
  return m('#categories', 'Categories', []);
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

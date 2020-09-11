/* global window */
export function bind (target, name, fn) {
  target.addEventListener(name, fn)
}

export function unbind (target, name, fn) {
  target.removeEventListener(name, fn)
}

export function unbindClickoutside (el) {
  if (el.xclickoutside) {
    unbind(window.document.body, 'click', el.xclickoutside)
    delete el.xclickoutside
  }
}

// the left mouse button: mousedown → mouseup → click
// the right mouse button: mousedown → contenxtmenu → mouseup
// the right mouse button in firefox(>65.0): mousedown → contenxtmenu → mouseup → click on window
export function bindClickoutside (el, cb) {
  el.xclickoutside = (evt) => {
    // ignore double click
    // console.log('evt:', evt);
    if (evt.detail === 2 || el.contains(evt.target)) return
    if (cb) {
      cb(el)
    } else {
      el.hide()
      unbindClickoutside(el)
    }
  }
  bind(window.document.body, 'click', el.xclickoutside)
}

export function mouseMoveUp (target, movefunc, upfunc) {
  bind(target, 'mousemove', movefunc)
  const t = target
  t.xEvtUp = (evt) => {
    // console.log('mouseup>>>');
    unbind(target, 'mousemove', movefunc)
    unbind(target, 'mouseup', target.xEvtUp)
    upfunc(evt)
  }
  bind(target, 'mouseup', target.xEvtUp)
}

function calTouchDirection (spanx, spany, evt, cb) {
  let direction = ''
  // console.log('spanx:', spanx, ', spany:', spany);
  if (Math.abs(spanx) > Math.abs(spany)) {
    // horizontal
    direction = spanx > 0 ? 'right' : 'left'
    cb(direction, spanx, evt)
  } else {
    // vertical
    direction = spany > 0 ? 'down' : 'up'
    cb(direction, spany, evt)
  }
}

// cb = (direction, distance) => {}
export function bindTouch (target, { move, end }) {
  let startx = 0
  let starty = 0
  bind(target, 'touchstart', (evt) => {
    const { pageX, pageY } = evt.touches[0]
    startx = pageX
    starty = pageY
  })
  bind(target, 'touchmove', (evt) => {
    if (!move) return
    const { pageX, pageY } = evt.changedTouches[0]
    const spanx = pageX - startx
    const spany = pageY - starty
    if (Math.abs(spanx) > 10 || Math.abs(spany) > 10) {
      // console.log('spanx:', spanx, ', spany:', spany);
      calTouchDirection(spanx, spany, evt, move)
      startx = pageX
      starty = pageY
    }
    evt.preventDefault()
  })
  bind(target, 'touchend', (evt) => {
    if (!end) return
    const { pageX, pageY } = evt.changedTouches[0]
    const spanx = pageX - startx
    const spany = pageY - starty
    calTouchDirection(spanx, spany, evt, end)
  })
}

export default class Events {
  constructor () {
    this.__handlers__ = Object.create(null)
  }

  on (eventName, callback) {
    if (!this.__handlers__[eventName]) {
      this.__handlers__[eventName] = []
    }
    this.__handlers__[eventName].push(callback)
  }

  off (el, eventName, callback) {
    const events = this.__handlers__[eventName]
    if (events) {
      events.splice(events.indexOf(callback), 1)
    }
  }

  emit (eventName) {
    const events = this.__handlers__[eventName]
    if (events) {
      events.forEach(callBack => {
        callBack.apply(null, Array.prototype.slice.call(arguments, 1))
      })
    }
  }

  destroy () {
    this.__handlers__ = null
  }
}

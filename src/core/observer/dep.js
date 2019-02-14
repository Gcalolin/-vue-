/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  //將sub push到數組中,每個dep實例都有一個數組去存儲他的watcher並且在notify()方法執行的時候去執行update()方法
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }
  //移除sub
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    //Dep.target是一個watcher
    if (Dep.target) {
      //addDep名字暗示著一個watcher watching很多dep
      Dep.target.addDep(this)
    }
  }

  //notity()方法會在property的setter裡面被調用，所以當你改變這個reactive property的時候，它就會觸發watcher的update
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
//全局唯一
Dep.target = null
//目標堆
const targetStack = []


//在evaluation期間，如果一個watcher想要得到另一個watcher的value，必須先把當前的target存起來，切到新的target，然後等它完成之後在返回 ？？？

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

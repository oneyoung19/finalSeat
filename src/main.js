import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 自定义组件
import Seat from '@/views/Seat'
// 第三方包
import AlloyFinger from 'alloyfinger'
Vue.component('seat', Seat)

Vue.config.productionTip = false
// 指令---1滚动(行数栏跟着滚动)  2跟随   3 回弹
Vue.directive('scroll', {
  inserted (el) {
    // 解决微信浏览器默认的下拉效果
    document.body.addEventListener('touchmove', function (e) {
      e.preventDefault()
    }, { passive: false })
    // 触摸起始y,起始x,结束x,结束y,距离x,距离y
    let startY
    let startX
    let endX = 0
    let endY = 0
    // 放大比例
    let scale = 0.5
    // 是否点击放大了,默认值为false,
    let flag = false
    // 放大之后保证transform具有scale
    let str = 'scale(' + scale + ')'
    // 控制比例(超出自身高度或者宽度的固定比值后回弹)--当为2时,座位图呈缩小状态,但是本身el.offsetHeight和offsetWidth依然为初始值,所以设置比例
    let bili = 1.25
    // 通过canvas去获取行数栏
    let rowBar = el.parentNode.nextElementSibling.children[0]
    // TODO:双指还是单指
    let isFingers = false
    // FIXME:tap事件---tap事件需要手动封装优化 click事件在移动端具有300ms的延迟,其他库封装的tap事件的事件对象e中没有offsetX
    // el.addEventListener('click', function (e) {
    //   if (flag) {
    //     return
    //   }
    //   let x = Math.floor(e.offsetX)
    //   let y = Math.floor(e.offsetY)
    //   this.style.transform = 'scale(' + scale + ')'
    //   this.style.transition = 'all ease 0.2s'
    //   rowBar.style.transform = 'scale(' + scale + ')'
    //   rowBar.style.transition = 'all ease 0.2s'

    //   this.style.transformOrigin = x + 'px ' + y + 'px'
    //   rowBar.style.transformOrigin = 5 + 'px ' + y + 'px'
    //   flag = true
    // })

    // console.log(el)
    // console.log(el.offsetHeight)
    // row.style.top = el.offsetHeight / 2 - 150 + 'px'
    el.style.transform = `scale(0.5)`
    rowBar.style.transform = `scale(0.5)`
    // 触摸开始
    el.addEventListener('touchstart', (e) => {
      // 判断手势---是普通的滑动还是手势捏
      e.touches.length === 2 ? isFingers = true : isFingers = false
      startY = e.touches[0].pageY
      startX = e.touches[0].pageX
    })
    // 触摸移动
    el.addEventListener('touchmove', (e) => {
      if (isFingers) {
        return
      }
      endY = e.changedTouches[0].pageY - startY
      endX = e.changedTouches[0].pageX - startX
      if (flag) {
        str = 'scale(1)'
        bili = 1
      } else {
        str = 'scale(' + scale + ')'
        bili = 2
      }
      // 拖拽超出一定距离的话,停止拖拽
      if (Math.abs(endY) > el.offsetHeight / bili || Math.abs(endX) > el.offsetWidth / bili) {
        return
      }
      el.style.transform = 'translate(' + endX + 'px,' + endY + 'px)' + str
      rowBar.style.transform = 'translateY(' + endY + 'px)' + str
    })
    // 触摸结束
    el.addEventListener('touchend', (e) => {
      if (isFingers) {
        return
      }
      endY = e.changedTouches[0].pageY - startY
      endX = e.changedTouches[0].pageX - startX
      console.log(endY)
      if (flag) {
        str = 'scale(1)'
        bili = 1
      } else {
        str = 'scale(' + scale + ')'
        bili = 2
      }
      // 如果resultY和resultX的绝对值大于了1/2的高和宽,就回弹到初始位置
      console.log(endY)
      console.log(el.offsetHeight)
      if (Math.abs(endY) > el.offsetHeight / bili) {
        el.style.transform = 'translateY(' + 0 + 'px)' + str
        rowBar.style.transform = 'translateY(' + 0 + 'px)' + str
        el.style.transition = 'all ease 0.5s'
        rowBar.style.transition = 'all ease 0.5s'
        endY = 0
        return
      }
      if (Math.abs(endX) > el.offsetWidth / bili) {
        el.style.transform = 'translateX(' + 0 + 'px)' + str
        rowBar.style.transform = 'translateY(' + 0 + 'px)' + str
        el.style.transition = 'all ease 0.5s'
        rowBar.style.transition = 'all ease 0.5s'
        endX = 0
        return
      }
      if (endX === 0 || endY === 0) {
        return
      }
      el.style.transform = 'translate(' + endX + 'px,' + endY + 'px)' + str
      el.style.transition = 'all ease 0.5s'
      // rowBar.style.top = endY + 'px'
      rowBar.style.transition = 'all ease 0.5s'
    })
    /* eslint-disable no-new */
    new AlloyFinger(el, {
      pinch (e) {
        if (!isFingers) {
          return
        }
        if (e.zoom > 1) {
          el.style.transform = 'scale(' + 1 + ')'
          el.style.transition = 'all ease 0.2s'
          rowBar.style.transform = 'scale(' + 1 + ')'
          rowBar.style.transition = 'all ease 0.2s'
          // 放大之后，为了保证可以以放大状态滑动，将flag标识赋值为true
          flag = true
        } else if (e.zoom < 1) {
          el.style.transform = 'scale(' + 0.5 + ')'
          el.style.transition = 'all ease 0.2s'
          rowBar.style.transform = 'scale(' + 0.5 + ')'
          rowBar.style.transition = 'all ease 0.2s'
          flag = false
        }
      }
    })
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

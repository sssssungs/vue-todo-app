import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home'
import About from '@/views/About'
import TodoApp from '@/views/TodoApp'

Vue.use(VueRouter)

const routes = [
  // config
  {
    name: 'index',
    path: '/',
    component: Home
  },
  {
    name: 'about',
    path: '/about',
    component: About
  },
  {
    name: 'todos',
    path: '/todos',
    redirect: '/todos/all',
    component: TodoApp,
    children: [ // nested url
      {
        name: 'todos-filter',
        path: ':id' // parameter 로 받아서 url 세팅
      }
    ]
  }
]

// 해시모드와 히스토리모드 ( hash mode / history mode )
// #(sharp)이 url에 붙어 있을 경우 해시모드, 없을경우 히스토리모드
// vue router는 기본적으로 해시모드로 설정되어 있으며
// url로 이동될때 index.html 페이지가 다시 로드되지 않는다.
// 해시를 제거하기 위해서는 히스토리 모드 사용 >> 서버 필요함
// 사용자가 히스토리 모드에서 url 입력할 경우 404 에러가 발생한다
// 문제 해결을 위해서는 서버에 전통적인 방법으로 페이지를 Return 해주어야 한다
// 히스토리 모드의 경우 404 에러일 때도 index.html를 Return 하기 때문에 이를 수정해주어야함.
// https://router.vuejs.org/kr/guide/essentials/history-mode.html#서버-설정-예제 참조

export default new VueRouter({
  // mode: 'history', // 설정할 경우 url과 api 구분이 안되는 문제점이 있음. #을 넣어서 하면 url로 구분함.
  routes
})

import Vue from 'vue'
import Vuex from 'vuex'
import todoApp from './todoApp'
Vue.use(Vuex);

// modules : 분기하는 처리 (각 container로)

const vuexObject = {
  //strict: true // 운영배포시 성능문제가 있을수 있으므로 운영배포시에는 false로 처리해야함
  strict: process.env.Node_ENV !== 'production',
  // 모듈화
  modules: {
    todoApp
  }
}

export default new Vuex.Store(vuexObject)
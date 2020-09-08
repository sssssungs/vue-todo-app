import Vue from 'vue'
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'

export default {
  namespaced: true, // 모듈화시 필수 - 독립적으로 관리하겠다.
  state: () => ({ // 참조관계 안되도록 함수형태로 리턴한다 ㅌㅔ스트.
    db: null,
    todos: [],
    filter: 'all'
  }),
  getters: { // computed
    all (state) {
      return state.todos.length
    },
    todo (state) {
      return state.todos.filter(v => v.done === false).length
    },
    completed (state, getters) { // getters 파라미터 통해서 해당 getter로 접근가능
      return getters.all - getters.todo
    },
    filteredTodo (state) {
      switch (state.filter) {
        case 'all':
          return state.todos
        case 'active':
          return state.todos.filter(v => v.done === false)
        case 'complete':
          return state.todos.filter(v => v.done === true)
        default:
          return state.todos
      }
    }
  },
  mutations: { // 비동기처리가 안됨. 데이터 변경 가능.
    updateFilter (state, filter) {
      state.filter = filter
    },
    assignDB (state, db) { // actions와 다르게 바로 state를 꺼내서 쓸수 있음.
      state.db = db
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    createDB (state, newTodo) {
      state.db
        .get('todos')
        .push(newTodo)
        .write()
    },
    pushTodo (state, newTodo) {
      state.todos.push(newTodo) // 지금 state로 변경시켜주는 형태;;; 매뉴얼로;;
    },
    updateDB (state, { todo, value }) {
      state.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()
    },
    assignTodo (state, { found, value }) {
      _assign(found, value)
    },
    deleteDB (state, todo) {
      state.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
    },
    deleteTodo (state, found) {
      Vue.delete(state.todos, found)
    },
    updateTodo (state, { todo, key, value }) {
      todo[key] = value
    }
  },
  actions: { // 일반적인 로직 가능. 데이터의 변경은 불가능. 데이터 변경은 mutation 에서만 가능
    initDB ({ state, commit }) { // context.state, context.commit을 통해서 mutation에 접근가능
      const adapter = new LocalStorage('todo-app')
      // local db init
      commit('assignDB', lowdb(adapter)) // assignDB 실행

      const hasTodos = state.db.has('todos').value()

      if (hasTodos) {
        commit('assignTodos', _cloneDeep(state.db.getState().todos))
        // state.todos = _cloneDeep(state.db.getState().todos);
      } else {
        state.db.defaults({
          todos: []
        }).write()
      }
    },
    createTodo ({ state, commit }, title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }

      commit('createDB', newTodo)
      commit('pushTodo', newTodo)
    },
    updateTodo ({ state, commit }, { todo, value }) { // actions 에서 받을때는 parameter가 두개만 허용
      // lowdb에서 넘어오는것을 chain으로 받기 때문에 find에 조건만 적으면 된다
      // 보통은 find(array, {찾을조건객체})
      commit('updateDB', { todo, value })

      const found = _find(state.todos, { id: todo.id })
      commit('assignTodo', { found, value })
      // Object.assign(found, value);
    },
    deleteTodo ({ state, commit }, todo) {
      commit('deleteDB', todo)
      // Vue.delete() == this.$delete
      const found = _findIndex(state.todos, { id: todo.id })
      commit('deleteTodo', found)
    },
    completedAll ({ state, commit }, checked) {
      const newTodos = state.db
        .get('todos')
        .forEach(v => { commit('updateTodo', { todo: v, key: 'done', value: checked }) })
        .write()

      commit('assignTodos', _cloneDeep(newTodos))
      // state.todos = _cloneDeep(newTodos)
    },
    deleteComplete ({ state, dispatch }) {
      _forEachRight(state.todos, todo => {
        if (todo.done) {
          dispatch('deleteTodo', todo)
        }
      })
      // state.db
      //   .get('todos')
      //   .remove({done:true})
      //   .write();
      // state.todos = state.todos.filter(v => v.done !== true)
    }
  }
}

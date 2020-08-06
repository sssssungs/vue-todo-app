export default {
  namespaced: true, //모듈화시 필수 - 독립적으로 관리하겠다.
  state: () => ({ // 참조관계 안되도록 함수형태로 리턴한다
    db: null,
    toods: [],
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
  },
  mutations: { // 비동기처리가 안됨. 데이터 변경 가능.
    assignDB (state, db) { // actions와 다르게 바로 state를 꺼내서 쓸수 있음.
      state.db = db
    },
    assignTodos (state, todos) {
      state.todos = todos
    }
  },
  actions: { // 일반적인 로직 가능. 데이터의 변경은 불가능. 데이터 변경은 mutation 에서만 가능
    initDB ({ state, commit }) { // context.state, context.commit을 통해서 mutation에 접근가능
      const adapter = new LocalStorage('todo-app');
      
      //local db init
      //state.db = lowdb(adapter);
      commit('assignDB', lowdb(adapter)); //assignDB 실행

      const hasTodos = state.db.has('todos').value();
      
      if (hasTodos) {
        commit('assignTodos', _cloneDeep(state.db.getState().todos))
        // state.todos = _cloneDeep(state.db.getState().todos);
      } else {
        state.db.defaults({
          todos: []
        }).write();
      }
    },
  }
}
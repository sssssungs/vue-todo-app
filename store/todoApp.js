export default {
  namespaced: true, //모듈화시 필수 - 독립적으로 관리하겠다.
  state: () => ({ // 참조관계 안되도록 함수형태로 리턴한다

  }),
  getters: {},
  mutatioins: {},
  actions: {
    initDB () {
      const adapter = new LocalStorage('todo-app');
      //local db init
      this.db = lowdb(adapter);
      
      const hasTodos = this.db.has('todos').value();
      // console.log(hasTodos)
      
      if (hasTodos) {
        this.todos = _cloneDeep(this.db.getState().todos);
      } else {
        this.db.defaults({
          todos: []
        }).write();
      }
    },
  }
}
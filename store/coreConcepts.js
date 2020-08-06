export default {
  namespaced: true,
  state: () => ({
    a: 123,
    b: []
  }),
  getters: { // computed
    someGetter1 (state, getters) { // state, getters에 접근할수 있는 param
      return state.a + 1
    },
    someGetter2 (state, getters) {
      return state.a + getters.someGetter1
    }
  },
  mutations: {
    someMutation (state, payload) { // state, payload(전달값)
      state.a = 789
      state.b.push(payload)
    }
  },
  actions: {
    someAction1 (context, payload) {
      // context: state, getters, commit(mutation실행), dispatch(action실행)
      context.commit('someMutation', payload)
    },
    someAction2 (context, payload) {
      context.commit('someMutation')
      context.dispatch('someAction1', payload)
    }
  }
}

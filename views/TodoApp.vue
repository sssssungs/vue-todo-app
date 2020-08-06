<template>
  <div class="todo-app">
    <div class="todo-app__actions">
      <div class="filters">
        <router-link
          to="all"
          tag="button"
          >모든항목 ({{ all }})</router-link>
        <router-link
          to="active"
          tag="button"
          >Todo ({{ todo }})</router-link>
        <router-link
          to="complete"
          tag="button"
          >Complete ({{ completed }})</router-link>
      </div>
      <div class="actions clearfix">
        <div class="float--left">
          <label>
          <input
          type="checkbox"
          v-model="allDone" />
          <span class="icon">
            <i class="material-icons">done_all</i>
          </span>
          </label>
        </div>
        <div class="float--right clearfix">
          <button class="btn float--left" @click="scrollTop">
            <i class="material-icons">expand_less</i>
          </button>
          <button class="btn float--left" @click="scrollBottom">
            <i class="material-icons">expand_more</i>
          </button>
          <button
            class="btn btn--danger float--left"
            @click="deleteComplete">
            <i class="material-icons">delete_sweep</i>
          </button>
        </div>
      </div>
    </div>

    <div class="todo-app__list">
      <todo-item
        v-for="todo in filteredTodo"
        :key="todo.id"
        :todo="todo"
      />
    </div>

    <todo-creator
      class="todo-app__creator"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TodoCreator from '@/components/TodoCreator'
import TodoItem from '@/components/TodoItem'
// import dayjs from 'dayjs'
import scrollTo from 'scroll-to'

export default {
  components: {
    TodoItem, TodoCreator
  },
  created () {
    this.initDB()
  },
  computed: {
    // ******** helpers *******
    // 첫번째: namespace, 두번째 배열: 가져올 state의 이름들
    ...mapState('todoApp', [
      'todos'
    ]),
    ...mapGetters('todoApp', [
      'all',
      'todo',
      'completed',
      'filteredTodo'
    ]),
    allDone: {
      get () {
        return this.all === this.completed && this.all > 0
      },
      set (checked) {
        this.completedAll(checked)
      }
    }
  },
  watch: {
    $route () {
      this.updateFilter(this.$route.params.id)
    }
  },
  methods: {
    ...mapMutations('todoApp', [
      'updateFilter'
    ]),
    ...mapActions('todoApp', [
      'initDB',
      'deleteComplete',
      'completedAll'
    ]),
    scrollTop () {
      scrollTo(0, 0)
    },
    scrollBottom () {
      scrollTo(0, document.body.scrollHeight)
    }
  }

}
</script>
<style lang="scss">
  @import 'scss/style';
  .filters button.router-link-active {
    background: royalblue;
    color: white;
  }
</style>

<template>
  <div class="todo-app">
    <div class="todo-app__actions">
      <div class="filters">
        <router-link
          to="all" 
          tag="button"
          >모든항목 ({{all}})</router-link>
        <router-link
          to="active" 
          tag="button"
          >Todo ({{todo}})</router-link>
        <router-link
          to="complete" 
          tag="button"
          >Complete ({{completed}})</router-link>
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
        @update-todo="updateTodo"
        @delete-todo="deleteTodo"
      />
    </div>

    <todo-creator
      class="todo-app__creator"
      @create-todo-from-child="createTodo"
    />
  </div>
</template>

<script>
import lowdb from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import _cloneDeep from 'lodash/cloneDeep';
import _find from 'lodash/find';
import _assign from 'lodash/assign';
import _findIndex from 'lodash/findIndex';
import cryptoRandomString from 'crypto-random-string';
import TodoCreator from '@/components/TodoCreator';
import TodoItem from '@/components/TodoItem';
import dayjs from 'dayjs';
import scrollTo from 'scroll-to';

export default {
  components: {
    TodoItem, TodoCreator
  },
  created() {
    this.initDB();
  },
  computed: {
    filteredTodo () {
      switch(this.$route.params.id) {
        case 'all':
          return this.todos
        case 'active':
          return this.todos.filter(v => v.done === false)
        case 'complete':
          return this.todos.filter(v => v.done === true)
        default:
          return this.todos
      }
    },
    allDone: {
      get () {
        return this.all === this.completed && this.all > 0
      },
      set (checked) {
        this.completedAll(checked)
      }
    }
  },
  methods: {
    //create new todo
    createTodo (title) {
      const newTodo = {
        id: cryptoRandomString({length: 10}),
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      };

      this.db
        .get('todos')
        .push(newTodo)
        .write();
      
      this.todos.push(newTodo); // 지금 state로 변경시켜주는 형태;;; 매뉴얼로;;
    },
    updateTodo (todo, value) {
      // lowdb에서 넘어오는것을 chain으로 받기 때문에 find에 조건만 적으면 된다
      // 보통은 find(array, {찾을조건객체})
      this.db
        .get("todos")
        .find({ id: todo.id })
        .assign(value)
        .write();

      const found = _find(this.todos, { id: todo.id });
      _assign(found, value);
      // Object.assign(found, value);
    },
    deleteTodo (todo, value) {
      this.db
        .get("todos")
        .remove({id: todo.id})
        .write();

      this.$delete(this.todos, _findIndex(this.todos, {id: todo.id}))
      // this.todos = this.todos.filter(v => v.id !== todo.id);
    },
    // showList (button) {
    //   this.filter = button;
    // },
    completedAll (checked) {
      const newTodos = this.db
        .get('todos')
        .forEach(v => { v.done = checked })
        .write();
      this.todos = _cloneDeep(newTodos);
    },
    deleteComplete () {
      this.db
        .get('todos')
        .remove({done:true})
        .write();
      this.todos = this.todos.filter(v => v.done !== true)
    },
    scrollTop () {
      scrollTo(0, 0)
    },
    scrollBottom () {
      scrollTo(0, document.body.scrollHeight)

    }
  },

}
</script>
<style lang="scss">
  @import 'scss/style';
  .filters button.router-link-active {
    background: royalblue;
    color: white;
  }
</style>
<template>
  <div class="todo-app">

    <div class="todo-app__actions">
      <div class="filters">
        <button
          :class="{ active: filter === 'all' }"
          @click="showList('all')">모든항목 ({{all}})</button>
        <button
          :class="{ active: filter === 'active' }"
          @click="showList('active')">Todo ({{todo}})</button>
        <button
          :class="{ active: filter === 'complete' }"
          @click="showList('complete')">Complete ({{all-todo}})</button>
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

    <hr />
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
import TodoCreator from './TodoCreator';
import TodoItem from './TodoItem';
import dayjs from 'dayjs';

export default {
  components: {
    TodoItem, TodoCreator
  },
  data () {
    return {
      db: null,
      todos: [],
      filter: 'all'
    }
  },
  created() {
    this.initDB();
  },
  computed: {
    all: {
      get () {
        return this.todos.length
      }
    },
    todo: {
      get () {
        return this.todos.filter(v => v.done === false).length
      }
    },
    filteredTodo () {
      switch(this.filter) {
        case 'all':
          return this.todos
        case 'active':
          return this.todos.filter(v => v.done === false)
        case 'complete':
          return this.todos.filter(v => v.done === true)
        default:
          return this.todos
      }
    }
  },
  methods: {
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
    showList (button) {
      this.filter = button;
    }
  },

}
</script>
<style scoped lang="scss">
.todo-app {
  .todo-app__actions {
    .filters {
      button.active {
        font-weight: bold;
      }
    }
  }
}
</style>
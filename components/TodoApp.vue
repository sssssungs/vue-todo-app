<template>
  <div>
    <todo-item 
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @update-todo="updateTodo"
      @delete-todo="deleteTodo"
    />
    <hr />
    <todo-creator
      @create-todo-from-child="createTodo"/>
  </div>
</template>

<script>
import lowdb from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import _cloneDeep from 'lodash/cloneDeep';
import cryptoRandomString from 'crypto-random-string';
import TodoCreator from './TodoCreator';
import TodoItem from './TodoItem';

export default {
  components: {
    TodoItem, TodoCreator
  },
  data () {
    return {
      db: null,
      todos: []
    }
  },
  created() {
    this.initDB();
  },
  methods: {
    initDB () {
      const adapter = new LocalStorage('todo-app');
      //local db init
      this.db = lowdb(adapter);
      
      const hasTodos = this.db.has('todos').value();
      console.log(hasTodos)
      
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
      this.db.get('todos').push(newTodo).write();
    },
    updateTodo (todo, value) {
      console.log("update")
    },
    deleteTodo (todo, value) {
      console.log("delete", value)
    }
  },

}
</script>
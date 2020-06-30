<template>
  <div>
    <todo-item />
    <todo-creator
      @create-todo-from-child="createTodo"/>
  </div>
</template>

<script>
import lowdb from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import cryptoRandomString from 'crypto-random-string';
import TodoCreator from './TodoCreator';
import TodoItem from './TodoItem';

export default {
  components: {
    TodoItem, TodoCreator
  },
  data () {
    return {
      db: null
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
      this.db.defaults({
        todos: []
      }).write();
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
    }
  },

}
</script>
<template>
  <div class="todo-item">
    <input 
      type="checkbox" 
      v-model="done"
    />
    <div class="item__title-wrap">
      <div class="item_title">
        {{ todo.title }}
      </div>
    </div>
    <div class="item__date">
      {{ date }}
    </div>
    <div class="item__actions">
      <button @click="onEditMode">Modify</button>
      <button @click="deleteTodo">Delete</button>
    </div>

    </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
  props: {
    todo: Object
  },
  data () {
    return {
      isEditMode: false
    }
  },
  computed: {
    done: {
      get () {
        return this.todo.done
      },
      set (done) {
        this.updateTodo({
          done
        })
      }
    },
    date () {
      const created = this.todo.createdAt.substring(0,10);
      const updated = this.todo.updatedAt.substring(0,10);
      const isSame = created === updated
      // console.log("isame", date, isSame)
      if(isSame) {
        return created;
      }
      else {
        return `${created} (edited)`
      }
    }
  },
  methods: {
    updateTodo (value) {
      this.$emit('update-todo', this.todo, value)
    },
    onEditMode () {

    },
    deleteTodo (value) {
      this.$emit('delete-todo', this.todo, value)
    }
  }
}
</script>
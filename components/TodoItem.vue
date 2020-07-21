<template>
  <div class="todo-item">
    <div 
      class="item__inner item--edit"
      v-if="isEditMode">
      <input 
        type="text" 
        :value="editedTitle" 
        @input="editedTitle=$event.target.value"
        @keypress.enter="editedTodo"
        @keypress.esc="offEditMode" />
      <div class="item__actions">
        <button 
          key="complete" 
          @click="editedTodo">완료</button>
        <button 
          key="cancel"
          @click="offEditMode">취소</button>
      </div>
    </div>
    <div 
      class="item__inner item--normal"
      v-else >
    </div>
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
      isEditMode: false,
      editedTitle: ''
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
      const isSame = created === updated;
      return isSame ? created : `${created} (edited)`;
    }
  },
  methods: {
    updateTodo (value) {
      this.$emit('update-todo', this.todo, value)
    },
    onEditMode () {
      this.isEditMode = true; //!this.isEditMode
      this.editedTitle = this.todo.title;
    },
    offEditMode () {
      this.isEditMode = false;
    },
    editedTodo () {

    },
    deleteTodo (value) {
      this.$emit('delete-todo', this.todo, value)
    }
  }
}
</script>
<template>
  <div>
    <button
      @click="createTodo"
    >추가</button>
    <input 
      :value="title"
      :placeholder="placeholder"
      type="text" 
      @input="title=$event.target.value"
      @keypress.enter="createTodo"
      />
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      placeholder: 'Enter todo'
    }
  },
  methods: {
    resetTitle () {
      this.title = '';
      this.placeholder = 'Enter todo';
    },
    createTodo () {
      if(this.title.length && this.title.trim().length){
        this.title = this.title.trim();
        this.$emit('create-todo-from-child', this.title);
        this.resetTitle();
      } else {
        alert('todo 를 입력하시오');
      }
    }
  }
}
</script>
<template>
  <div>
    <button @click="createTodo">
      <i class="material-icons">add</i>
    </button>
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
      this.title = ''
      this.placeholder = 'Enter todo'
    },
    createTodo () {
      if (this.title.length && this.title.trim().length) {
        this.title = this.title.trim()

        // actions 접근시 dispatch, mutation 접근시 commit
        this.$store.dispatch('todoApp/createTodo', this.title)
        // this.$emit('create-todo-from-child', this.title);

        this.resetTitle()
        this.$nextTick(() => {
          window.scrollTo(0, document.body.scrollHeight)
        })
      } else {
        alert('todo 를 입력하시오')
      }
    }
  }
}
</script>

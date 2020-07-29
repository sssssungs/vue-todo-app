<template>
  <div 
    class="todo-item"
    :class="{ done }">
    <div 
      class="item__inner item--edit"
      v-if="isEditMode">
      <input 
        type="text" 
        ref="titleInput"
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
        <button 
          key="update"
          @click="onEditMode">수정</button>
        <button 
          key="delete" 
          @click="deleteTodo">삭제</button>
      </div>
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
      const created = dayjs(this.todo.createdAt).format('YYYY/MM/DD');
      const isSame = dayjs(this.todo.createdAt).isSame(dayjs(this.todo.updatedAt));
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
      // dom 이 렌더링 된 다음에 실행이 되는것을 보장
      this.$nextTick(() => {
        this.$refs.titleInput.focus();
      })
    },
    offEditMode () {
      this.isEditMode = false;
    },
    editedTodo () {
      if(this.todo.title !== this.editedTitle)
        this.updateTodo({
          title: this.editedTitle,
          updatedAt: new Date()
        });

      this.offEditMode();
    },
    deleteTodo (value) {
      this.$emit('delete-todo', this.todo, value)
    }
  }
}
</script>

<style scoped lang="scss">
.todo-item {
  margin-bottom:10px;

  .item__inner {
    display: flex;
  }
  .item__date {
    font-size: 12px;
  }
  &.done {
    .item__title-wrap {
      text-decoration: line-through;
    }
  }

}
</style>
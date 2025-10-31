<script setup>
import { ref } from 'vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

const showReplyForm = ref(false)
const newReply = ref('')

// In a real app, this would emit an event to the parent to handle the reply submission
const submitReply = () => {
  if (newReply.value.trim()) {
    // This is where you would typically call a store action or emit an event
    // to add the reply to the comment's replies array.
    // For this example, we'll just log it.
    console.log(`Replying to comment ${props.comment.id} with: ${newReply.value}`)
    props.comment.replies.unshift({
      id: Date.now(),
      author: 'You',
      date: new Date().toLocaleDateString(),
      text: newReply.value,
      replies: []
    })
    newReply.value = ''
    showReplyForm.value = false
  }
}
</script>

<template>
  <div class="comment-item">
    <div class="comment-header">
      <span class="comment-author">{{ comment.author }}</span>
      <span class="comment-date">{{ comment.date }}</span>
    </div>
    <div class="comment-body">
      <p>{{ comment.text }}</p>
    </div>
    <div class="comment-footer">
      <button @click="showReplyForm = !showReplyForm" class="reply-btn">Reply</button>
    </div>

    <div v-if="showReplyForm" class="reply-form">
      <textarea v-model="newReply" placeholder="Write a reply..."></textarea>
      <button @click="submitReply">Submit Reply</button>
    </div>

    <div v-if="comment.replies && comment.replies.length > 0" class="comment-replies">
      <CommentItem v-for="reply in comment.replies" :key="reply.id" :comment="reply" />
    </div>
  </div>
</template>

<style scoped>
.comment-item {
  border-left: 2px solid #eee;
  padding-left: 1.5rem;
  margin-top: 1.5rem;
}
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.comment-author {
  font-weight: bold;
  color: #333;
}
.comment-date {
  font-size: 0.8rem;
  color: #888;
}
.comment-body p {
  margin: 0;
  color: #555;
}
.comment-footer {
  margin-top: 0.5rem;
}
.reply-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.9rem;
}
.reply-form {
  margin-top: 1rem;
}
.reply-form textarea {
  width: 100%;
  min-height: 60px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.reply-form button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.comment-replies {
  margin-top: 1rem;
}
</style>
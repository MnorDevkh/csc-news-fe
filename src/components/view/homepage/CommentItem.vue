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
  <div class="border-l-2 border-gray-200 pl-6 mt-6">
    <div class="flex justify-between items-center mb-2">
      <span class="font-bold text-gray-800">{{ comment.author }}</span>
      <span class="text-xs text-gray-500">{{ comment.date }}</span>
    </div>
    <div class="comment-body">
      <p class="m-0 text-gray-600">{{ comment.text }}</p>
    </div>
    <div class="mt-2">
      <button @click="showReplyForm = !showReplyForm" class="bg-transparent border-none text-blue-600 cursor-pointer text-sm hover:underline">
        Reply
      </button>
    </div>

    <div v-if="showReplyForm" class="mt-4">
      <textarea v-model="newReply" placeholder="Write a reply..." class="w-full min-h-[60px] p-2 border border-gray-300 rounded-md"></textarea>
      <button @click="submitReply" class="mt-2 px-4 py-2 bg-blue-600 text-white border-none rounded-md cursor-pointer hover:bg-blue-700">
        Submit Reply
      </button>
    </div>

    <div v-if="comment.replies && comment.replies.length > 0" class="mt-4">
      <CommentItem v-for="reply in comment.replies" :key="reply.id" :comment="reply" />
    </div>
  </div>
</template>
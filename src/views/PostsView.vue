<template>
  <v-container :fluid="true">
    <v-row gutter="16">
      <v-col class="d-flex flex-grow-1">
        <v-text-field
          label="Search by Name"
          :single-line="true"
          :hide-details="true"
          density="compact"
          variant="outlined"
          v-model="storeSearch"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" variant="flat" size="large" @click="postDialogToggle(true)">
          Add
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="postDialog" max-width="500" @after-leave="postDialogToggle(false)">
      <v-card>
        <v-card-title>
          {{ postDialogEditId ? `Edit ${postDialogEditId}` : 'Add Post' }}
        </v-card-title>
        <v-card-text>
          <v-textarea
            :single-line="true"
            :hide-details="true"
            density="compact"
            variant="outlined"
            label="Name"
            v-model="postDialogName"
            outlined
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            variant="flat"
            color="primary"
            @click="postUpsert"
            :disabled="!postDialogName.trim()"
          >
            Save
          </v-btn>
          <v-btn variant="text" @click="postDialogToggle(false)">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row gutter="16">
      <v-col cols="12" md="3" v-for="post in storeFilteredPosts" :key="post.id">
        <v-lazy :height="200" transition="fade-transition">
          <v-card
            :height="200"
            :variant="postHoverId === post.id ? 'tonal' : 'outlined'"
            @mouseover="postHoverId = post.id"
            @mouseleave="postHoverId = null"
          >
            <v-card-title>Post</v-card-title>
            <v-card-subtitle>ID: {{ post.id }}</v-card-subtitle>
            <v-card-text> Name: {{ post.name }} </v-card-text>
            <v-card-actions>
              <v-btn variant="flat" color="primary" @click="postDialogToggle(true, post.id)">
                Edit
              </v-btn>
              <v-btn variant="flat" color="red" @click="postDelete(post.id)">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { type Post, usePostsStore } from '@/stores/posts'

export default defineComponent({
  setup() {
    const store = usePostsStore()
    const storeSearch = ref('')
    const storeFilteredPosts = computed(() => {
      return store.posts.filter((post) => {
        return post.name.toLowerCase().includes(storeSearch.value.toLowerCase())
      })
    })

    const postHoverId = ref<string | null>(null)
    const postDialog = ref(false)
    const postDialogEditId = ref<string | null>(null)
    const postDialogName = ref('')

    const postDialogToggle = (toggle: boolean, id: string | null = null) => {
      postDialog.value = toggle
      postDialogEditId.value = id
      postDialogName.value = (() => {
        if (id) {
          const post: Post | undefined = store.posts.find((post: Post) => post.id === id)

          if (post) {
            return post.name
          }
        }

        return ''
      })()
    }

    const postUpsert = () => {
      if (postDialogName.value.trim()) {
        if (postDialogEditId.value) {
          store.updatePost(postDialogEditId.value, postDialogName.value)
        } else {
          store.createPost(postDialogName.value.trim())
        }

        postDialogName.value = ''
        postDialogToggle(false)
      }
    }

    const postDelete = (id: string) => {
      store.deletePost(id)
    }

    return {
      storeSearch,
      storeFilteredPosts,
      postDialog,
      postDialogEditId,
      postDialogName,
      postDialogToggle,
      postHoverId,
      postUpsert,
      postDelete,
    }
  },
})
</script>

import { defineStore } from 'pinia'
import { generateId, getPosts, setPosts } from '@/services/db'

export type Post = {
  id: string
  name: string
}

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: getPosts(),
  }),
  actions: {
    createPost(name: string) {
      this.posts.unshift({
        id: generateId(),
        name,
      })
    },
    deletePost(id: string) {
      this.posts = this.posts.filter((post: Post) => post.id !== id)
    },
    updatePost(id: string, name: string) {
      const post: Post | undefined = this.posts.find((post: Post) => post.id === id)

      if (post) {
        post.name = name
      }
    },
  },
})

// ls sync

const store = usePostsStore()

store.$onAction(({ after }) => {
  after(() => setPosts(store.posts))
})

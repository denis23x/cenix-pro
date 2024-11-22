import { defineStore } from 'pinia'
import { posts } from '../assets/test.json'
import { customAlphabet } from 'nanoid'

const id = customAlphabet('0123456789abcdef', 24)

const db = (): Post[] => {
  const ls: string | null = localStorage.getItem('posts')

  return ls ? JSON.parse(ls) : posts
}

export type Post = {
  id: string
  name: string
}

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: db(),
  }),
  actions: {
    createPost(name: string) {
      this.posts.unshift({
        id: id(),
        name,
      })

      this.savePosts()
    },
    deletePost(id: string) {
      this.posts = this.posts.filter((post: Post) => post.id !== id)

      this.savePosts()
    },
    updatePost(id: string, name: string) {
      const post: Post | undefined = this.posts.find((post: Post) => post.id === id)

      if (post) {
        post.name = name
      }

      this.savePosts()
    },
    savePosts() {
      localStorage.setItem('posts', JSON.stringify(this.posts))
    },
  },
})

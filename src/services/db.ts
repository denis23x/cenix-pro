import { customAlphabet } from 'nanoid'
import type { Post } from '@/stores/posts'
import { posts as seed } from '../assets/test.json'

export const generateId = customAlphabet('0123456789abcdef', 24)

export const getPosts = (): Post[] => {
  const posts: string | null = localStorage.getItem('posts')

  return posts ? JSON.parse(posts) : seed
}

export const setPosts = (posts: Post[]) => {
  localStorage.setItem('posts', JSON.stringify(posts))
}

export interface CommunityPost {
    id: string
    author: {
      name: string
      username: string
      avatar?: string
    }
    title: string
    description: string
    tags: string[]
    files?: {
      type: 'image' | 'file'
      url: string
    }[]
    likes: number
    comments: {
      id: string
      author: {
        name: string
        username: string
        avatar?: string
      }
      text: string
      replies: {
        id: string
        author: { name: string; username: string; avatar?: string }
        text: string
        createdAt: string
      }[]
      createdAt: string
    }[]
    createdAt: string
  }
  
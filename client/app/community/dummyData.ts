import { CommunityPost } from "./types";

export const communityPosts: CommunityPost[] = [
  {
    id: 'community_001',
    author: {
      name: 'Anu',
      username: 'CreativeWriterAnu',
      avatar: '/avatars/anu.png',
    },
    title: 'Looking for Storyboard Artists for Short Film!',
    description:
      `We're developing an indie short film about urban loneliness. Need visually expressive storyboard panels for emotional scenes.`,
    tags: ['Trending'],
    files: [
      {
        type: 'image',
        url: '/community/ideas.jpg',
      },
    ],
    likes: 124,
    comments: [
      {
        id: 'comment_001',
        author: {
          name: 'Manu S',
          username: 'StoryboardPro',
          avatar: '/avatars/manu.png',
        },
        text: '@CreativeWriterAnu Would love to collaborate! I\'ve worked on indie films before, can I share my sample boards?',
        replies: [
          {
            id: 'reply_001_001',
            author: {
              name: 'Anu',
              username: 'CreativeWriterAnu',
              avatar: '/avatars/anu.png',
            },
            text: '@StoryboardPro Yes, please! Would love to see your portfolio. DM me?',
            createdAt: '1h ago',
          },
          {
            id: 'reply_001_002',
            author: {
              name: 'Priya Kumar',
              username: 'PriyaDesigns',
              avatar: '/avatars/priya.png',
            },
            text: '@StoryboardPro I\'ve seen your work before - it\'s amazing! This project would be perfect for you.',
            createdAt: '1h ago',
          },
          {
            id: 'reply_001_003',
            author: {
              name: 'Manu S',
              username: 'StoryboardPro',
              avatar: '/avatars/manu.png',
            },
            text: '@CreativeWriterAnu Awesome! Sending you a DM now with my recent work.',
            createdAt: '45m ago',
          },
        ],
        createdAt: '2h ago',
      },
      {
        id: 'comment_002',
        author: {
          name: 'Ravi Menon',
          username: 'RaviMenon',
          avatar: '/avatars/ravi.png',
        },
        text: '@CreativeWriterAnu Urban loneliness is an interesting theme. Do you have a mood board or color palette in mind?',
        replies: [
          {
            id: 'reply_002_001',
            author: {
              name: 'Anu',
              username: 'CreativeWriterAnu',
              avatar: '/avatars/anu.png',
            },
            text: '@RaviMenon Thinking muted blues and grays with occasional warm tones for emotional moments. Very "Lost in Translation" vibes.',
            createdAt: '1h ago',
          },
          {
            id: 'reply_002_002',
            author: {
              name: 'Sarah Chen',
              username: 'SarahColorist',
              avatar: '/avatars/sarah.png',
            },
            text: 'That color palette sounds perfect for the theme. Have you considered adding some neon accents for the urban setting?',
            createdAt: '1h ago',
          },
          {
            id: 'reply_002_003',
            author: {
              name: 'Ravi Menon',
              username: 'RaviMenon',
              avatar: '/avatars/ravi.png',
            },
            text: '@SarahColorist Great suggestion! Neon could really emphasize the isolation in a crowded city.',
            createdAt: '30m ago',
          },
        ],
        createdAt: '2h ago',
      },
      {
        id: 'comment_003',
        author: {
          name: 'Lisa Wong',
          username: 'LisaAnimation',
          avatar: '/avatars/lisa.png',
        },
        text: 'This sounds like a beautiful project! What\'s your timeline looking like?',
        replies: [
          {
            id: 'reply_003_001',
            author: {
              name: 'Anu',
              username: 'CreativeWriterAnu',
              avatar: '/avatars/anu.png',
            },
            text: '@LisaAnimation We\'re hoping to start production in 2 months. Storyboards needed within 3-4 weeks.',
            createdAt: '1h ago',
          },
        ],
        createdAt: '1h ago',
      },
      {
        id: 'comment_004',
        author: {
          name: 'Dev Patel',
          username: 'DevFilmmaker',
          avatar: '/avatars/dev.png',
        },
        text: 'Urban loneliness is such a relevant topic right now. Would love to follow the progress of this!',
        replies: [],
        createdAt: '30m ago',
      },
    ],
    createdAt: '2h ago',
  },
  {
    id: 'community_002',
    author: {
      name: 'Rajesh Kumar',
      username: 'RajeshSciFi',
      avatar: '/avatars/rajesh.png',
    },
    title: 'Best Tips for Writing a Sci-Fi Script?',
    description: 'What are some must-have elements in a futuristic setting?',
    tags: ['Trending'],
    files: [
      {
        type: 'image',
        url: '/community/scifi.jpg',
      },
    ],
    likes: 89,
    comments: [
      {
        id: 'comment_005',
        author: {
          name: 'Maya Reddy',
          username: 'MayaWriter',
          avatar: '/avatars/maya.png',
        },
        text: 'World-building is key! Create consistent rules for your universe and stick to them.',
        replies: [
          {
            id: 'reply_005_001',
            author: {
              name: 'Rajesh Kumar',
              username: 'RajeshSciFi',
              avatar: '/avatars/rajesh.png',
            },
            text: '@MayaWriter That\'s great advice! Any tips on keeping track of all the rules?',
            createdAt: '1h ago',
          },
          {
            id: 'reply_005_002',
            author: {
              name: 'Maya Reddy',
              username: 'MayaWriter',
              avatar: '/avatars/maya.png',
            },
            text: '@RajeshSciFi I use a world-building bible document. Everything from tech specs to social structures goes in there!',
            createdAt: '45m ago',
          },
        ],
        createdAt: '3h ago',
      },
      {
        id: 'comment_006',
        author: {
          name: 'Tom Anderson',
          username: 'TomSciFiGeek',
          avatar: '/avatars/tom.png',
        },
        text: 'Don\'t forget the human element! Even in the most advanced future, emotions and relationships matter.',
        replies: [],
        createdAt: '2h ago',
      },
    ],
    createdAt: '4h ago',
  },
  {
    id: 'community_003',
    author: {
      name: 'Neha Sharma',
      username: 'NehaDirector',
      avatar: '/avatars/neha.png',
    },
    title: 'Documentary Filmmakers - Let\'s Connect!',
    description: 'Starting a documentary about traditional craftsmen in India. Looking for collaborators and advice.',
    tags: ['Documentary', 'Collaboration'],
    files: [],
    likes: 56,
    comments: [
      {
        id: 'comment_007',
        author: {
          name: 'Arjun Verma',
          username: 'ArjunDocs',
          avatar: '/avatars/arjun.png',
        },
        text: 'This sounds fascinating! What crafts are you focusing on?',
        replies: [
          {
            id: 'reply_007_001',
            author: {
              name: 'Neha Sharma',
              username: 'NehaDirector',
              avatar: '/avatars/neha.png',
            },
            text: '@ArjunDocs Initially focusing on handloom weavers and pottery makers in rural areas.',
            createdAt: '2h ago',
          },
          {
            id: 'reply_007_002',
            author: {
              name: 'Kavita Singh',
              username: 'KavitaCraft',
              avatar: '/avatars/kavita.png',
            },
            text: 'My family runs a handloom business. Happy to connect you with some amazing artisans!',
            createdAt: '1h ago',
          },
        ],
        createdAt: '3h ago',
      },
    ],
    createdAt: '5h ago',
  },
]
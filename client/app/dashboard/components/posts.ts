import { PostType } from "../components/Post";

export const posts = [
  {
    id: "post_101",
    author: {
      name: "Ravi Menon",
      jobRole: "Scriptwright",
      profile: "/avatars/ravi.png",
    },
    title: "Lost in Time – A Sci-Fi Thriller",
    description:
      "A thrilling sci-fi story about a scientist who discovers a hidden dimension in time and becomes trapped in an endless loop of his own past mistakes.",
    type: "synopsis" as PostType,
    likes: 8989,
    comments: 898,
    synopsis:
      "A scientist discovers a hidden dimension in time, but when he tries to exploit it, he finds himself trapped in an endless loop of his own past mistakes. A scientist discovers a hidden dimension in time, but when he tries to exploit it, he finds himself trapped in an endless loop of his own past mistakes.A scientist discovers a hidden dimension in time, but when he tries to exploit it, he finds himself trapped in an endless loop of his own past mistakes.A scientist discovers a hidden dimension in time, but when he tries to exploit it, he finds himself trapped in an endless loop of his own past mistakes. A scientist discovers a hidden dimension in time, but when he tries to exploit it, he finds himself trapped in an endless loop of his own past mistakes.A scientist discovers a hidden dimension in time, but when he tries to exploit it, he finds himself trapped in an endless loop of his own past mistakes.",
    price: 6000,
  },
  {
    id: "post_103",
    author: {
      name: "Karthik Pillai",
      jobRole: "Storyboard Creator",
      profile: "/avatars/karthik.png",
    },
    title: "The Perfect Cup – Coffee Ad Storyboard",
    description:
      "A visually captivating storyboard for a coffee advertisement that illustrates the journey of a coffee bean from farm to cup, highlighting the craftsmanship and passion behind every brew.",
    type: "storyboard" as PostType,
    likes: 8989,
    comments: 898,
    storyboard: {
      image: "/storyboards/perfect-cup.png",
    },
    price: 6000,
  },
  {
    id: "post_102",
    author: {
      name: "Anita Verma",
      jobRole: "Story Architect",
      profile: "/avatars/anita.png",
    },
    title: "The Perfect Cup – Coffee Ad Script",
    description:
      "A compelling coffee advertisement script that captures the essence of a perfect morning.",
    type: "script" as PostType,
    likes: 8989,
    comments: 898,
    rightsLabel: "Exclusive Licence",
    genre: ["Drama"],
    script: {
      price: 6000,
      currency: "INR",
      content: [
        {
          name: "Sample",
          scenes: [
            {
              name: "Scene 1 – Midnight (0–5 sec)",
              description: `🎵 Eerie wind howls in the background.
      📷 A dimly lit warehouse, shadows stretching across the floor.
      
      Voiceover (Whispered, tense):
      "Some secrets are never meant to be uncovered..."`,
            },
            {
              name: "Scene 2 – Footsteps in the Dark (6–12 sec)",
              description: `🎵 Slow, suspenseful heartbeat-like drumming.
      📷 James and Lisa step cautiously inside, their silhouettes barely visible.
      
      💬 James (whispering):
      "We shouldn’t be here, Lisa."`,
            },
            {
              name: "Scene 3 – The Unknown Figure (13–20 sec)",
              description: `🎵 Sudden rise in tension, distant metallic clang.
      📷 A shadow moves across the far wall.
      
      💬 Lisa (urgent whisper):
      "We need to find the file and get out."`,
            },
            {
              name: "Scene 4 – The Unknown Figure (21–25 sec)",
              description: `🎵 Sudden rise in tension, distant metallic clang.
      📷 A shadow moves across the far wall.`,
            },
            {
              name: "Scene 5 – The Unknown Figure (26–28 sec)",
              description: `🎵 Sudden rise in tension, distant metallic clang.
      📷 A shadow moves across the far wall.`,
            },
            {
              name: "Scene 6 – The Unknown Figure (29–30 sec)",
              description: `🎵 Sudden rise in tension, distant metallic clang.
      📷 A shadow moves across the far wall.`,
            },
          ],
        },
      ],
    },
  },
];

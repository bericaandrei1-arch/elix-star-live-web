import { create } from 'zustand';

interface Video {
  id: number | string;
  url: string;
  username: string;
  description: string;
  likes: string;
  comments: string;
  shares: string;
  song: string;
  avatar: string;
  isLocal?: boolean; // Să știm că e filmat de noi
}

interface VideoStore {
  videos: Video[];
  addVideo: (video: Video) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  videos: [
    {
      id: 1,
      url: 'https://cdn.pixabay.com/video/2024/02/09/199958-911694865_large.mp4',
      username: 'elix_star',
      description: 'Chasing the sunset vibes 🌅 #elix #live',
      likes: '1.2K',
      comments: '85',
      shares: '45',
      song: 'Original Sound - Elix Star',
      avatar: 'https://i.pravatar.cc/150?u=elix'
    },
    {
      id: 2,
      url: 'https://cdn.pixabay.com/video/2024/05/24/213560_large.mp4',
      username: 'nature_lover',
      description: 'Beautiful nature vibes 🌸 #nature #peace',
      likes: '5.4K',
      comments: '230',
      shares: '890',
      song: 'Nature Sounds - Relax',
      avatar: 'https://i.pravatar.cc/150?u=bunny'
    },
    {
      id: 3,
      url: 'https://cdn.pixabay.com/video/2023/10/19/185714-876123049_large.mp4',
      username: 'dreamer_01',
      description: 'Family time is the best time ❤️ #family',
      likes: '890',
      comments: '34',
      shares: '12',
      song: 'Happy Moments - Family',
      avatar: 'https://i.pravatar.cc/150?u=dreamer'
    }
  ],
  addVideo: (video) => set((state) => ({ videos: [video, ...state.videos] })),
}));

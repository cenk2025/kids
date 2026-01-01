
export interface StoryPage {
  text: string;
  imagePrompt: string;
  imageUrl?: string;
  audioData?: string;
}

export interface Story {
  title: string;
  pages: StoryPage[];
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

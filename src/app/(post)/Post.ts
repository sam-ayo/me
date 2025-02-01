export interface Post {
  title: string;
  tags: string[];
  date: Date;
  content: string;
  views: number;
}

export interface PostPreview {
  title: string;
  id: string;
  tags: string[];
  date: Date;
  views: number;
}

export interface YearPosts {
  year: number;
  posts: PostPreview[];
}

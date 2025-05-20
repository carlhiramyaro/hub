export interface Community {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  members: string[];
  imageUrl: string | null;
}

export interface Post {
  id: string;
  communityId: string;
  authorId: string;
  content: string;
  mediaUrls: string[];
  createdAt: Date;
  updatedAt: Date;
  likes: string[];
  comments: string[]; // Array of comment IDs
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: string[];
}

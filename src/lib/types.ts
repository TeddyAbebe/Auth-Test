export interface User {
  email: string;
  password: string;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  readable_publish_date: string;
  cover_image: string | null;
  tag_list: string[];
  positive_reactions_count: number;
  comments_count: number;
  reading_time_minutes: number;
  user: {
    name: string;
  };
  organization?: {
    name: string;
  };
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

import axios from "axios";
import { User, Post } from "./types";

const apiClient = axios.create({
  baseURL: "https://dev.to/api",
  timeout: 10000,
});

export const signup = async (user: User): Promise<User> => {
  const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
  if (users.some((u) => u.email === user.email)) {
    throw new Error("User already exists");
  }
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  return user;
};

export const login = async (user: User): Promise<User> => {
  const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
  const foundUser = users.find(
    (u) => u.email === user.email && u.password === user.password
  );
  if (!foundUser) {
    throw new Error("Invalid credentials");
  }
  return foundUser;
};

export const fetchPosts = async (page: number = 1): Promise<Post[]> => {
  try {
    const response = await apiClient.get<Post[]>("/articles", {
      params: {
        per_page: 5,
        page,
      },
    });
    console.log(`fetchPosts: Page ${page} fetched successfully`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "fetchPosts: Axios error",
        error.message,
        error.response?.status
      );
      throw new Error(`Failed to fetch posts: ${error.message}`);
    } else {
      console.error("fetchPosts: Unexpected error", error);
      throw new Error("Failed to fetch posts: An unexpected error occurred");
    }
  }
};

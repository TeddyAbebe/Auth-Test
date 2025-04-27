import axios from "axios";
import { User, TeamResponse } from "./types";

const apiClient = axios.create({
  baseURL: "https://teamcheckout.com/api",
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

export const fetchTeamData = async (): Promise<TeamResponse> => {
  try {
    const response = await apiClient.get<TeamResponse>("/teams/42");
    console.log("fetchTeamData: Team data fetched successfully", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "fetchTeamData: Axios error",
        error.message,
        error.response?.status
      );
      throw new Error(`Failed to fetch team data: ${error.message}`);
    } else {
      console.error("fetchTeamData: Unexpected error", error);
      throw new Error(
        "Failed to fetch team data: An unexpected error occurred"
      );
    }
  }
};

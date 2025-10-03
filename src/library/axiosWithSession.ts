import axios from "axios";
import { auth } from "@/auth";
import { NextApiRequest, NextApiResponse } from "next";

export async function axiosWithSession() {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized: No session found");
  }

  const instance = axios.create({
    baseURL: "http://localhost:8080/api/v1/",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error("API error:", error?.response?.data || error.message);
      return Promise.reject(error);
    }
  );
  return instance;
}

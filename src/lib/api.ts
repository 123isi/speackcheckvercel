import axios from "axios";
import { getAccessToken } from "./token";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:8080";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  console.log("🔑 Access Token:", token ? `${token.substring(0, 20)}...` : "없음");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Authorization 헤더 추가됨");
  } else {
    console.warn("⚠️ Access Token이 없습니다!");
  }
  return config;
});

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === "object" && "status" in data) {
      throw new ApiError(
        data.status as number,
        (data.code as string) || "UNKNOWN",
        (data.message as string) || "오류가 발생했습니다."
      );
    }

    throw new ApiError(
      error.response?.status || 500,
      "NETWORK_ERROR",
      error.message || "네트워크 오류가 발생했습니다."
    );
  }

  throw new ApiError(500, "UNKNOWN_ERROR", "알 수 없는 오류가 발생했습니다.");
}

export async function submitVideoUrl(speechId: string, videoUrl: string): Promise<void> {
  try {
    await apiClient.put(`http://54.180.133.135:8000/speech/video/${speechId}`, {
      video_source: videoUrl,
    });
  } catch (error) {
    handleApiError(error);
  }
}

export async function submitDocumentUrl(speechId: string, documentUrl: string): Promise<void> {
  try {
    await apiClient.put(`http://54.180.133.135:8000/speech/document/${speechId}`, {
      document_url: documentUrl,
    });
  } catch (error) {
    handleApiError(error);
  }
}

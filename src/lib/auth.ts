import axios, { AxiosError } from "axios";
import type {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
  ErrorResponse,
  ServiceErrorResponse,
} from "@/types/auth";
import { getAccessToken } from "./token";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:8080";

const authClient = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  withCredentials: true, // Send cookies with requests
});

export class AuthError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

function handleAuthError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<
      ErrorResponse | ServiceErrorResponse
    >;

    if (axiosError.response?.data) {
      const data = axiosError.response.data;

      // Handle global error format
      if ("status" in data && "code" in data) {
        throw new AuthError(data.status, data.code, data.message);
      }

      // Handle service error format (sign-up failures)
      if ("code" in data && "message" in data) {
        throw new AuthError(data.code, `SERVICE-${data.code}`, data.message);
      }
    }

    // Fallback for network errors
    throw new AuthError(
      axiosError.response?.status || 500,
      "NETWORK_ERROR",
      axiosError.message || "네트워크 오류가 발생했습니다."
    );
  }

  throw new AuthError(
    500,
    "UNKNOWN_ERROR",
    "알 수 없는 오류가 발생했습니다."
  );
}

export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  try {
    const response = await authClient.post<SignUpResponse>("/sign-up", data);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await authClient.post<LoginResponse>("/login", data);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
}

export async function logout(): Promise<LogoutResponse> {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new AuthError(401, "NO_TOKEN", "로그인이 필요합니다.");
    }

    const response = await authClient.get<LogoutResponse>("/logout", {
      headers: {
        access_token: token,
      },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
}

export async function refreshToken(): Promise<RefreshResponse> {
  try {
    const token = getRefreshToken();
    if (!token) {
      throw new AuthError(401, "NO_REFRESH_TOKEN", "리프레시 토큰이 없습니다.");
    }

    const response = await authClient.get<RefreshResponse>("/refresh", {
      headers: {
        refresh_token: token,
      },
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
}

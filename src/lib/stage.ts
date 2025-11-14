import { apiClient, handleApiError } from "./api";
import type {
  CreateStageRequest,
  CreateStageResponse,
  UpdateStageRequest,
  UpdateStageResponse,
  DeleteStageResponse,
  StageListItem,
  StageDetailResponse,
} from "@/types/stage";

export async function createStage(
  data: CreateStageRequest
): Promise<CreateStageResponse> {
  try {
    const response = await apiClient.post<CreateStageResponse>("https://speakcheck-back.onrender.com/stage", data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateStage(
  stageId: string,
  data: UpdateStageRequest
): Promise<UpdateStageResponse> {
  try {
    const response = await apiClient.patch<UpdateStageResponse>(
      `https://speakcheck-back.onrender.com/stage/${stageId}`,
      data
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteStage(
  stageId: string
): Promise<DeleteStageResponse> {
  try {
    const response = await apiClient.delete<DeleteStageResponse>(
      `https://speakcheck-back.onrender.com/stage/${stageId}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getStageList(
  sortBy: "time" | "word" = "time"
): Promise<StageListItem[]> {
  try {
    const response = await apiClient.get<StageListItem[]>("https://speakcheck-back.onrender.com/stage", {
      params: { q: sortBy },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getStageDetail(
  stageId: string
): Promise<StageDetailResponse> {
  try {
    const response = await apiClient.get<StageDetailResponse>(
      `https://speakcheck-back.onrender.com/stage/${stageId}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

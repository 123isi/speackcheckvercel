// Stage API Types

export interface CreateStageRequest {
  stageName: string;
  situation: string;
  checkList: string;
}

export interface CreateStageResponse {
  stageId: string;
  stageName: string;
  stages: unknown[];
}

export interface UpdateStageRequest {
  stageName: string;
}

export interface UpdateStageResponse {
  stageId: string;
  message: string;
}

export interface DeleteStageResponse {
  stageId: string;
  message: string;
}

export interface StageListItem {
  stageId: string;
  stageName: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpeechItem {
  speechId: string;
  speechName: string;
}

export interface StageDetailResponse {
  stageId: string;
  stageName: string;
  speeches: SpeechItem[];
}

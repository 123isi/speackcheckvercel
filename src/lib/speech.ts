import { apiClient, handleApiError } from "./api";
import type {
  SpeechCreateRequest,
  SpeechVideoUpdateRequest,
  SpeechDocumentUpdateRequest,
  QuestionAnswerRequest,
  SpeechRecord,
  SpeechFeedbackResponse,
  QuestionListResponse,
  QuestionAnswerResponse,
} from "@/types/speech";

export async function createSpeech(data: SpeechCreateRequest): Promise<unknown> {
  try {
    const response = await apiClient.post("https://123isi.com/speech", data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getSpeech(speechId: string): Promise<SpeechRecord> {
  try {
    const response = await apiClient.get(`https://123isi.com/speech/${speechId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteSpeech(speechId: string): Promise<unknown> {
  try {
    const response = await apiClient.delete(`https://123isi.com/speech/${speechId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateSpeechVideo(
  speechId: string,
  data: SpeechVideoUpdateRequest
): Promise<unknown> {
  try {
    const response = await apiClient.put(`https://123isi.com/speech/video/${speechId}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateSpeechDocument(
  speechId: string,
  data: SpeechDocumentUpdateRequest
): Promise<unknown> {
  try {
    const response = await apiClient.put(`https://123isi.com/speech/document/${speechId}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getQuestions(speechId: string): Promise<QuestionListResponse> {
  try {
    console.log("getQuestions - Requesting:", `https://123isi.com/question/${speechId}`);
    const response = await apiClient.get(`https://123isi.com/question/${speechId}`);
    console.log("getQuestions - Response:", response);
    console.log("getQuestions - Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("getQuestions - Error:", error);
    handleApiError(error);
  }
}

export async function answerQuestion(
  questionId: string,
  data: QuestionAnswerRequest
): Promise<QuestionAnswerResponse> {
  try {
    // Set default request_feedback to true if not provided
    const payload = {
      ...data,
      request_feedback: data.request_feedback ?? true,
    };
    const response = await apiClient.post(
      `https://123isi.com/question/answer/${questionId}`,
      payload
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function createFeedback(speechId: string): Promise<SpeechFeedbackResponse> {
  try {
    const response = await apiClient.post(`https://123isi.com/speech/${speechId}/feedback`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getFastApiStage(stageId: string): Promise<unknown> {
  try {
    const response = await apiClient.get(`https://speakcheck-back.onrender.com/fastapi/stage/${stageId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

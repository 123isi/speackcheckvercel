// Speech API Types

export interface SpeechCreateRequest {
  stage_id: string;
  title: string;
}

export interface SpeechVideoUpdateRequest {
  video_source: string;
}

export interface SpeechDocumentUpdateRequest {
  document_url: string;
}

export interface QuestionAnswerRequest {
  answer: string;
  request_feedback?: boolean;
}

export interface SpeechRecord {
  id: string;
  stage_id: string;
  title: string;
  speech_name: string | null;
  video_source: string | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SpeechFeedbackResponse {
  speech_id: string;
  feedback: string;
  scores: {
    [key: string]: number;
  };
}

export interface Question {
  id: string;
  speech_id: string;
  question: string;
  answer: string | null;
  model_answer: string;
  created_at: string;
}

export type QuestionListResponse = Question[];

export interface QuestionAnswerResponse {
  question_id: string;
  user_answer: string;
  feedback?: string;
  score?: number;
}

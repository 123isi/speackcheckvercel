"use client";

import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import BottomNavigationBar from "@/components/common/bottomnavigation";
import { useRouter, useSearchParams } from "next/navigation";
import { Back, Delete, MainFront, Record } from "../../../../public/svg";
import IconMediumBtn from "@/components/button/IconMediumBtn";
import NewptCard from "@/components/card/NewptCard";
import DataCard from "@/components/card/DataCard";
import QuestionCard from "@/components/card/QuestionCard";
import { useEffect, useState } from "react";
import { getSpeech, createFeedback } from "@/lib/speech";
import type { SpeechRecord, SpeechFeedbackResponse } from "@/types/speech";

export default function NewPtResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stageId = searchParams?.get("stageId") || null;
  const presentationId = searchParams?.get("presentationId") || searchParams?.get("speechId") || null;
  const titleParam = searchParams?.get("title") || "";
  
  const [speechData, setSpeechData] = useState<SpeechRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [feedbackData, setFeedbackData] = useState<SpeechFeedbackResponse | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string>("");

  useEffect(() => {
    const fetchSpeech = async () => {
      if (!presentationId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getSpeech(presentationId);
        setSpeechData(data);
        console.log("Speech data:", data);
      } catch (err: any) {
        console.error("Failed to fetch speech:", err);
        setError(err.message || "발표 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpeech();
  }, [presentationId]);
  


  const handleDelete = () => {
    if (!stageId || !presentationId) return;
    
    const storageKey = `presentations:${stageId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const presentations = JSON.parse(saved);
        const filtered = presentations.filter((p: { id: string }) => p.id !== presentationId);
        localStorage.setItem(storageKey, JSON.stringify(filtered));
      } catch (error) {
        console.error('Failed to delete presentation:', error);
      }
    }
    
    router.push(`/stage/settings/${stageId}`);
  };

  const handleGenerateFeedback = async () => {
    if (!presentationId) return;

    setIsGeneratingFeedback(true);
    setFeedbackError("");

    try {
      const feedback = await createFeedback(presentationId);
      setFeedbackData(feedback);
      console.log("Feedback generated:", feedback);
      console.log("Feedback scores:", feedback.scores);
      console.log("Scores keys:", Object.keys(feedback.scores));
      console.log("Scores entries:", Object.entries(feedback.scores));
    } catch (err: any) {
      console.error("Failed to generate feedback:", err);
      let errorMessage = "피드백 생성에 실패했습니다.";
      if (err.status === 404) {
        errorMessage = "발표를 찾을 수 없습니다.";
      } else if (err.status === 409) {
        errorMessage = "완료된 전사(transcription)를 찾을 수 없습니다. 영상 처리가 완료된 후 다시 시도해주세요.";
      }
      setFeedbackError(errorMessage);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  return (
    <Page>
      <MainContainer>
        <HeaderRow>
          <BackButton onClick={() => router.back()}>
            <Back width={24} height={24} />
          </BackButton>
          <ActionButtons>
            <IconMediumBtn
              width={120}
              icon={<Delete width={16} height={16} color={color.form} />}
              onClick={handleDelete}
            >
              삭제
            </IconMediumBtn>
          </ActionButtons>
        </HeaderRow>

        <Title>
          {((speechData?.title || titleParam).length > 7 
            ? (speechData?.title || titleParam).substring(0, 7) + '...' 
            : (speechData?.title || titleParam))}
        </Title>

        {isLoading && <LoadingText>로딩 중...</LoadingText>}
        {error && <ErrorText>{error}</ErrorText>}

{speechData && (
          <>
            <SectionCard>
              <Row>
                <Record width={24} height={24} />  
                {speechData.video_source ? (
                  <FileLink href={speechData.video_source} target="_blank" rel="noopener noreferrer">
                    영상 보기
                  </FileLink>
                ) : (
                  "영상 없음"
                )}
              </Row>
              {speechData.document_url && (
                <Row style={{ marginTop: "8px" }}>
                  📄{" "}
                  <FileLink href={speechData.document_url} target="_blank" rel="noopener noreferrer">
                    문서 보기
                  </FileLink>
                </Row>
              )}
            </SectionCard>
            
            <InfoCard>
              <InfoRow>
                <InfoLabel>생성일:</InfoLabel>
                <InfoValue>{new Date(speechData.created_at).toLocaleString('ko-KR')}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>수정일:</InfoLabel>
                <InfoValue>{new Date(speechData.updated_at).toLocaleString('ko-KR')}</InfoValue>
              </InfoRow>
            </InfoCard>
          </>
        )}

        <IconMediumBtn
          width={200}
          onClick={handleGenerateFeedback}
          disabled={isGeneratingFeedback || !speechData}
        >
          {isGeneratingFeedback ? "피드백 생성 중..." : "피드백 생성"}
        </IconMediumBtn>

        {feedbackError && <ErrorText>{feedbackError}</ErrorText>}

        {feedbackData && (
          <>
            <Icon><MainFront width={45} height={35} /></Icon>
            <SectionCard>
              <FeedbackText>
                {feedbackData.feedback.split('•').map((line, index) => {
                  if (index === 0) return line;
                  return (
                    <span key={index}>
                      •{line}
                      {index < feedbackData.feedback.split('•').length - 1 && <br />}
                    </span>
                  );
                })}
              </FeedbackText>
            </SectionCard>
          </>
        )}
        
        <NewptCard scores={feedbackData?.scores} />

        <DataCard scores={feedbackData?.scores} />

        <QuestionCard />
      </MainContainer>

      <BottomNavigationBar />
    </Page>
  );
}

const Page = styled.div`
  background-color: ${color.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  overflow-y: auto;
  width: 100%;
  position: relative;
`;

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  padding: 16px;
  width: 100%;
  max-width: 375px;
  margin-top: 30px;
  padding-bottom: 80px;
`;

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${color.form_pressing};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Icon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 12px;
  width: 100%;
`;

const Title = styled.h1`
  width: 100%;
  margin: 0;
  color: ${color.primary};
  font-family: ${font.H1};
`;

const SectionCard = styled.div`
  width: 100%;
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  box-shadow: ${color.shadow};
  border-radius: 8px;
  padding: 12px;
  color: ${color.primary};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${font.P2};
  color: ${color.default};
`;

const FeedbackText = styled.p`
  margin: 0;
  font-family: ${font.P1};
  color: ${color.primary};
`;

const LoadingText = styled.div`
  width: 100%;
  padding: 16px;
  text-align: center;
  font-family: ${font.P2};
  color: ${color.caption};
`;

const ErrorText = styled.div`
  width: 100%;
  padding: 12px 16px;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  font-family: ${font.P2};
  color: #c33;
  text-align: center;
`;

const FileLink = styled.a`
  color: ${color.primary};
  text-decoration: underline;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const InfoCard = styled.div`
  width: 100%;
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${font.P2};
`;

const InfoLabel = styled.span`
  color: ${color.caption};
  min-width: 60px;
`;

const InfoValue = styled.span`
  color: ${color.default};
`;


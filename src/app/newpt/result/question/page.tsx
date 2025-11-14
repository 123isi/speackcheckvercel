"use client";

import { useState, useEffect, Suspense } from "react";
import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import BottomNavigationBar from "@/components/common/bottomnavigation";
import { useRouter, useSearchParams } from "next/navigation";
import { Back, MainFront } from "../../../../../public/svg";
import MediumButton from "@/components/button/MediumBtn";
import { answerQuestion } from "@/lib/speech";

function ResultQuestionContent() {
  const router = useRouter();
  const params = useSearchParams();
  
  const [question, setQuestion] = useState("예상 질문");
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [modelAnswer, setModelAnswer] = useState("모범 답안이 없습니다.");
  
  const [answer, setAnswer] = useState("");
  const [showError, setShowError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (params) {
      setQuestion(params.get("title") || "예상 질문");
      setQuestionId(params.get("questionId"));
      setModelAnswer(params.get("modelAnswer") || "모범 답안이 없습니다.");
    }
  }, [params]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      setShowError(true);
      return;
    }

    if (!questionId) {
      setShowError(true);
      return;
    }

    setIsSubmitting(true);
    setShowError(false);

    try {
      console.log("Submitting answer for question:", questionId);
      const response = await answerQuestion(questionId, {
        answer: answer.trim(),
        request_feedback: true,
      });
      
      console.log("Answer response:", response);
      setFeedback(response.feedback || "피드백이 없습니다.");
      setScore(response.score || null);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Failed to submit answer:", error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    if (showError && e.target.value.trim()) {
      setShowError(false);
    }
  };

  return (
    <Page>
      <MainContainer>
        <HeaderRow>
          <BackButton onClick={() => router.back()} aria-label="뒤로 가기">
            <Back width={24} height={24} />
          </BackButton>
          <HeaderTitle>예상 질문</HeaderTitle>
          <Spacer />
        </HeaderRow>

        <ContentContainer>
          <QuestionSection>
            <QuestionText>{question}</QuestionText>
          </QuestionSection>

          <AnswerSection>
            <TextareaContainer>
              <Textarea
                placeholder="답변 입력"
                value={answer}
                onChange={handleAnswerChange}
                readOnly={isSubmitted}
              />
            </TextareaContainer>
            <ButtonWrapper>
              <MediumButton 
                width="100%" 
                onClick={handleSubmit}
                disabled={isSubmitting || isSubmitted}
              >
                {isSubmitting ? "제출 중..." : isSubmitted ? "제출 완료" : "답변하기"}
              </MediumButton>
              {showError && <ErrorMessage>답변을 입력해주세요</ErrorMessage>}
            </ButtonWrapper>
          </AnswerSection>

          {isSubmitted && (
            <>
              <FeedbackSection>
                <FeedbackIconWrapper>
                  <MainFront width={46} height={36} />
                </FeedbackIconWrapper>
                <FeedbackCard>
                  <FeedbackText>
                    {score !== null && `[점수: ${score}점]\n\n`}
                    {feedback}
                  </FeedbackText>
                </FeedbackCard>
              </FeedbackSection>

              <ModelAnswerCard>
                <ModelAnswerHeader>
                  <ModelAnswerTitle>모범 답안</ModelAnswerTitle>
                </ModelAnswerHeader>
                <ModelAnswerContent>{modelAnswer}</ModelAnswerContent>
              </ModelAnswerCard>
            </>
          )}
        </ContentContainer>
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

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  padding: 0 12px;
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

const HeaderTitle = styled.h2`
  flex: 1;
  text-align: center;
  margin: 0;
  font-family: ${font.P2};
  color: ${color.default};
`;

const Spacer = styled.div`
  width: 44px;
  height: 44px;
`;

const QuestionSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

const QuestionText = styled.h1`
  font-family: ${font.H1};
  color: ${color.default};
  margin: 0;
  line-height: 40px;
  text-align: left;
  width: 100%;
  white-space: pre-wrap;
`;

const AnswerSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

const TextareaContainer = styled.div`
  background-color: ${color.input};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
  height: 132px;
  width: 100%;
  padding: 12px 16px;
  box-sizing: border-box;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  color: ${color.default};
  font-family: ${font.P2};
  line-height: 22px;
  
  &::placeholder {
    color: ${color.caption};
  }
  
  &:focus {
    outline: none;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const ErrorMessage = styled.p`
  font-family: ${font.P2};
  color: ${color.warning};
  margin: 0;
  width: 100%;
  text-align: center;
`;

const FeedbackSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`;

const FeedbackIconWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  height: 36px;
`;

const FeedbackCard = styled.div`
  width: 100%;
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  box-shadow: ${color.shadow};
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeedbackText = styled.p`
  font-family: ${font.P1};
  color: ${color.primary};
  margin: 0;
  line-height: 22px;
  text-align: left;
  width: 100%;
  white-space: pre-wrap;
`;

const ModelAnswerCard = styled.div`
  width: 100%;
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  box-shadow: ${color.shadow};
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ModelAnswerHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const ModelAnswerTitle = styled.h3`
  font-family: ${font.P1};
  font-size: 18px;
  line-height: 24px;
  color: ${color.primary};
  margin: 0;
`;

const ModelAnswerContent = styled.p`
  font-family: ${font.P2};
  color: ${color.default};
  margin: 0;
  line-height: 22px;
  white-space: pre-wrap;
`;

export default function ResultQuestionPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResultQuestionContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <Page>
      <MainContainer>
        <HeaderRow>
          <Spacer />
          <HeaderTitle>로딩 중...</HeaderTitle>
          <Spacer />
        </HeaderRow>
      </MainContainer>
      <BottomNavigationBar />
    </Page>
  );
}

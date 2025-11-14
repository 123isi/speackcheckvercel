"use client";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import styled from "@emotion/styled";
import { useRouter, useSearchParams } from "next/navigation";
import { Front, MainFront, Record } from "../../../public/svg";
import { useEffect, useState } from "react";
import { getQuestions } from "@/lib/speech";
import type { Question } from "@/types/speech";

export default function QuestionCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stageId, setStageId] = useState<string | null>(null);
  const [presentationId, setPresentationId] = useState<string | null>(null);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (searchParams) {
      const stage = searchParams.get("stageId");
      const presentation = searchParams.get("presentationId") || searchParams.get("speechId");
      console.log("QuestionCard - stageId:", stage);
      console.log("QuestionCard - presentationId/speechId:", presentation);
      setStageId(stage);
      setPresentationId(presentation);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("QuestionCard - presentationId changed:", presentationId);
    
    const fetchQuestions = async () => {
      if (!presentationId) {
        console.log("QuestionCard - No presentationId, skipping fetch");
        return;
      }

      console.log("QuestionCard - Fetching questions for:", presentationId);
      setIsLoading(true);
      setError("");

      try {
        const data = await getQuestions(presentationId);
        setQuestions(data);
        console.log("Questions loaded:", data);
      } catch (err: any) {
        console.error("Failed to fetch questions:", err);
        setError("질문을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [presentationId]);

  return (
    <Section>
        <Title>예상 질문</Title>

        <UploadRow>
          <RowInner>
            <Record width={24} height={24} />
            <UploadLabel>채점기준표.(확장자)</UploadLabel>
          </RowInner>
        </UploadRow>
        <MainFront width={24} height={24} />
        
        {isLoading && <LoadingText>질문 로딩 중...</LoadingText>}
        {error && <ErrorText>{error}</ErrorText>}
        
        {questions && questions.length > 0 ? (
          <List>
            {questions.map((q) => (
              <SmallRow
                key={q.id}
                role="button"
                onClick={() => router.push(`/newpt/result/question?stageId=${encodeURIComponent(stageId ?? "")}&presentationId=${encodeURIComponent(presentationId ?? "")}&questionId=${encodeURIComponent(q.id)}&title=${encodeURIComponent(q.question)}`)}
              >
                <SmallText>{q.question}</SmallText>
                <RightIcon>
                  <Front width={12} height={12} />
                </RightIcon>
              </SmallRow>
            ))}
          </List>
        ) : !isLoading && !error && (
          <EmptyText>아직 생성된 질문이 없습니다.</EmptyText>
        )}
      </Section>
  );
}

const Section = styled.div`
  width: 100%;
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  box-shadow: ${color.shadow};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h2`
  font-family: ${font.P1};
  color: ${color.default};
  margin: 0;
  text-align: left;
  width: 100%;
`;

const UploadRow = styled.div`
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
  height: 64px;
  width: 100%;
  box-shadow: ${color.shadow};
  display: flex;
  align-items: center;
`;

const RowInner = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
`;

const UploadLabel = styled.p`
  font-family: ${font.P2};
  color: ${color.default};
  margin: 0;
`;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SmallRow = styled.div`
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
  height: 48px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: ${color.shadow};
`;

const SmallText = styled.p`
  font-family: ${font.P2};
  color: ${color.default};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
`;

const RightIcon = styled.span`
  display: inline-flex;
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

const EmptyText = styled.div`
  width: 100%;
  padding: 16px;
  text-align: center;
  font-family: ${font.P2};
  color: ${color.caption};
`;
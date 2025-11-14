"use client";

import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import BottomNavigationBar from "@/components/common/bottomnavigation";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Back } from "../../../public/svg";
import MediumButton from "@/components/button/MediumBtn";
import InputBtn from "@/components/button/InputBtn";
import { createSpeech } from "@/lib/speech";

export default function NewPresentationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stageId = useMemo(() => searchParams?.get("stageId") || null, [searchParams]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (!stageId) {
      router.push("/manage");
      return;
    }

    if (!title || title.trim().length === 0) {
      alert("발표명을 입력해주세요");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createSpeech({
        stage_id: stageId,
        title: title.trim(),
      });

      // Assuming the response contains speech_id
      const speechId = (response as any)?.speech_id || (response as any)?.id;
      
      if (speechId) {
        router.push(`/newpt/step2?stageId=${encodeURIComponent(stageId)}&speechId=${encodeURIComponent(speechId)}&title=${encodeURIComponent(title.trim())}`);
      } else {
        throw new Error("Speech ID not returned from API");
      }
    } catch (error) {
      console.error("Failed to create speech:", error);
      alert("발표 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <MainContainer>
        <FormCard>
          <HeaderRow>
            <BackButton onClick={() => router.back()} aria-label="뒤로 가기">
              <Back width={24} height={24} />
            </BackButton>
            <HeaderTitle>새로운 모의 발표</HeaderTitle>
            <Spacer />
          </HeaderRow>

          <Description>발표명을 입력해주세요</Description>

          <InputBtn 
            placeholder="발표명 입력" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            width="100%"
          />

          <MediumButton width={255} onClick={handleNext} disabled={isLoading}>
            {isLoading ? "생성 중..." : "다음"}
          </MediumButton>
        </FormCard>
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
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  width: 100%;
  max-width: 375px;
`;

const FormCard = styled.div`
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
  width: 100%;
  padding: 64px 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  width: 100%;
  margin-bottom: 12px;
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

const Description = styled.p`
  margin: 0;
  font-family: ${font.P2};
  color: ${color.caption};
  text-align: center;
  width: 100%;
`;


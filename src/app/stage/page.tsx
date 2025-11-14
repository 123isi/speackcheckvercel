"use client";

import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import BottomNavigationBar from "@/components/common/bottomnavigation";
import MediumButton from "@/components/button/MediumBtn";
import InputBtn from "@/components/button/InputBtn";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Main } from "../../../public/svg";

export default function Stage() {
  const [stageName, setStageName] = useState("");
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const handleNextClick = () => {
    if (stageName.trim() === "") {
      setShowError(true);
      return;
    }
    setShowError(false);
    try {
      sessionStorage.setItem('pendingStageName', stageName.trim());
    } catch (error) {
      console.error('Failed to save stage name:', error);
    }
    router.push(`/stage/settings`);
  };

  return (
    <CreatePage>
      <MainContainer>
        <FormContainer>
          <TitleSection>
            <TitleText>
              새로운 스테이지
              <br />
              시작하기
            </TitleText>
          </TitleSection>

          <IllustrationContainer>
          <Main width={280} height={200} />
          </IllustrationContainer>

          <FormSection>
            <InputBtn
              width="100%"
              placeholder="스테이지명 입력"
              value={stageName}
              onChange={(e) => {
                setStageName(e.target.value);
                if (e.target.value.trim() !== "") setShowError(false);
              }}
            />
            <MediumButton onClick={handleNextClick} width="100%">다음</MediumButton>
            {showError && <ErrorText>스테이지명을 입력해주세요</ErrorText>}
          </FormSection>
        </FormContainer>
      </MainContainer>

      <BottomNavigationBar />
    </CreatePage>
  );
}

const CreatePage = styled.div`
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
  gap: 24px;
  align-items: center;
  justify-content: center;
  padding: 16px;
  width: 100%;
  max-width: 375px;
`;

const FormContainer = styled.div`
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

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleText = styled.h1`
  font-family: ${font.H1};
  color: ${color.default};
  text-align: center;
  line-height: 40px;
  margin: 0;
`;

const IllustrationContainer = styled.div`
  position: relative;
  width: 279.4px;
  height: 199.845px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 0 12px;
`;

const ErrorText = styled.p`
  text-align: center;
  font-family: ${font.P2};
  color: ${color.warning};
  margin: 0;
`;

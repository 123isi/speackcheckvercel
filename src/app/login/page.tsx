"use client";

import { useState } from "react";
import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import BottomNavigation from "@/components/common/bottomnavigation";
import { useRouter } from "next/navigation";
import Logo from "../../../public/Logo";
import { login } from "@/lib/auth";
import { setTokens } from "@/lib/token";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await login({ email, password });
      
      // 토큰 저장
      if (response.access_token && response.refresh_token) {
        setTokens(response.access_token, response.refresh_token);
      }
      
      router.push("/stage");
    } catch (error: any) {
      console.error("로그인 실패:", error);
      alert(error.message || "로그인에 실패했습니다.");
    }
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <SignInPage>
      <MainContainer>
        <FormContainer>
          <LogoSection>
            <LogoContainer>
              <Logo width={100} height={100} />
            </LogoContainer>
            <TitleContainer>
              <TitleText>
                <span style={{ color: color.primary_m20 }}>더 나은 </span>
                <span style={{ color: color.primary_p10 }}>발표</span>
                <span style={{ color: color.primary_m20 }}>를 위한 끝없는</span>
                <span style={{ color: color.primary_p10 }}> 연습</span>
              </TitleText>
              <BrandText>SPEAK CHECK</BrandText>
            </TitleContainer>
          </LogoSection>

          <FormSection>
            <InputGroup>
              <LabelText>
                이메일 <RequiredMark>*</RequiredMark>
              </LabelText>
              <InputField 
                placeholder="이메일 입력" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            
            <InputGroup>
              <LabelText>
                비밀번호 <RequiredMark>*</RequiredMark>
              </LabelText>
              <InputField 
                type="password"
                placeholder="비밀번호 입력" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </FormSection>

          <ButtonSection>
            <LoginButton onClick={handleLogin}>로그인</LoginButton>
            <SignUpText>
              <SignUpQuestion>아직 가입하지 않으셨나요?</SignUpQuestion>{" "}
              <SignUpLink onClick={handleSignUp}>회원가입</SignUpLink>
            </SignUpText>
          </ButtonSection>
        </FormContainer>
      </MainContainer>
      <BottomNavigation />
    </SignInPage>
  );
}

const SignInPage = styled.div`
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
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const LogoContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  justify-content: center;
`;

const TitleText = styled.div`
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  margin: 0;
`;

const BrandText = styled.p`
  font-family:${font.H1};
  color: ${color.primary};
  text-align: center;
  line-height: 40px;
  margin: 0;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const LabelText = styled.p`
  ${font.P2}
  color: black;
  margin: 0;
`;

const RequiredMark = styled.span`
  color: ${color.warning};
`;

const InputField = styled.input`
  background-color: ${color.input};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
  height: 44px;
  padding: 0 16px;
  ${font.P2}
  color: black;
  width: 100%;
  
  &::placeholder {
    color: ${color.caption};
  }
  
  &:focus {
    outline: none;
    border-color: ${color.primary};
  }
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
`;

const LoginButton = styled.button`
  background-color: ${color.primary};
  color: ${color.button};
  border: none;
  border-radius: 8px;
  height: 44px;
  width: 100%;
  ${font.P1}
  cursor: pointer;
  box-shadow: 0px 4px 10px 0px rgba(77, 84, 69, 0.2);
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${color.primary_m10};
  }
  
  &:active {
    background-color: ${color.primary_p10};
  }
`;

const SignUpText = styled.p`
  ${font.caption}
  color: ${color.caption};
  margin: 0;
  text-align: center;
`;

const SignUpQuestion = styled.span`
  color: ${color.caption};
`;

const SignUpLink = styled.span`
  color: ${color.primary};
  text-decoration: underline;
  text-underline-position: from-font;
  cursor: pointer;
  
  &:hover {
    color: ${color.primary_m10};
  }
`;

"use client";

import { useState } from "react";
import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import BottomNavigation from "@/components/common/bottomnavigation";
import { useRouter } from "next/navigation";
import Logo from "../../../public/Logo";
import { signUp, AuthError } from "@/lib/auth";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [major, setMajor] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setError("");
    
    // Validation
    if (!email || !password || !age || !major) {
      setError("모든 필수 항목을 입력해주세요.");
      return;
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 0) {
      setError("올바른 나이를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await signUp({
        email,
        password,
        age: ageNum,
        major,
      });

      if (response.code === 200) {
        alert(response.message || "회원가입이 완료되었습니다. 로그인해주세요.");
        router.push("/login");
      }
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpPage>
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </InputGroup>

            <InputGroup>
              <LabelText>
                나이 <RequiredMark>*</RequiredMark>
              </LabelText>
              <InputField 
                type="number"
                placeholder="나이 입력" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={isLoading}
              />
            </InputGroup>

            <InputGroup>
              <LabelText>
                전공 <RequiredMark>*</RequiredMark>
              </LabelText>
              <InputField 
                placeholder="전공 입력" 
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                disabled={isLoading}
              />
            </InputGroup>
          </FormSection>

          {error && <ErrorText>{error}</ErrorText>}

          <SignUpButton onClick={handleSignUp} disabled={isLoading}>
            {isLoading ? "처리 중..." : "회원가입"}
          </SignUpButton>
        </FormContainer>
      </MainContainer>
      <BottomNavigation />
    </SignUpPage>
  );
}

const SignUpPage = styled.div`
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

const ErrorText = styled.p`
  ${font.P2}
  color: ${color.warning};
  text-align: center;
  margin: 0;
`;

const SignUpButton = styled.button`
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
  
  &:hover:not(:disabled) {
    background-color: ${color.primary_m10};
  }
  
  &:active:not(:disabled) {
    background-color: ${color.primary_p10};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;


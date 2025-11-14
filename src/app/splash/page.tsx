"use client";

import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useRouter } from 'next/navigation';
import Logo from '../../../public/Logo';
import Title from '../../../public/Title';
import color from '@/packages/design-system/color';
import font from '@/packages/design-system/font';

const circleExpand = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {  
    opacity: 1;
    transform: translateY(0);
  }
`;

const SplashPage = styled.div<{ stage: number }>`
  background-color: ${props => {
    if (props.stage >= 8) {
      return color.background;
    }
        return '#2A2C2B';
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh + env(safe-area-inset-bottom));
  width: 100%;
  max-width: 475px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 0;
  padding-bottom: env(safe-area-inset-bottom);
  overflow: ${props => props.stage >= 8 ? 'visible' : 'hidden'};
  transition: background-color 0.8s ease-in-out;
  font-family: 'Pretendard', sans-serif;
  z-index: 9999;
  cursor: ${props => props.stage >= 10 ? 'pointer' : 'default'};
`;

const SplashContainer = styled.div<{ stage: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: ${props => props.stage >= 8 ? 'visible' : 'hidden'};
`;

const Circle = styled.div<{ stage: number }>`
  position: absolute;
  background: ${color.background};
  border-radius: 50%;
  pointer-events: none;
  transition: all 0.8s ease-in-out;
  
  ${props => {
    const stage = props.stage;
    
    if (stage === 1) {
      return `
        width: 60px;
        height: 60px;
        left: 75%;
        top: 20%;
        transform: translate(-50%, -50%);
        opacity: 1;
        animation: ${circleExpand} 0.6s ease-out forwards;
      `;
    }

    if (stage === 2) {
      return `
        width: 60px;
        height: 60px;
        left: 50%;
        top: 60%;
        transform: translate(-50%, -50%);
        opacity: 1;
      `;
    }
    if (stage === 3) {
      return `
        width: 200px;
        height: 200px;
        left: 75%;
        top: 75%;
        transform: translate(-50%, -50%);
        opacity: 1;
      `;
    }
    if (stage === 4) {
      return `
        width: 300px;
        height: 300px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        opacity: 1;
      `;
    }
    if (stage === 5) {
      return `
        width: 400px;
        height: 400px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        opacity: 1;
      `;
    }
    if (stage === 6) {
      return `
        width: 500px;
        height: 500px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        opacity: 1;
      `;
    }
    

    if (stage === 7) {
      return `
        width: 90%;
        height: 90%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50px;
        opacity: 1;
      `;
    }
    

    if (stage >= 8) {
      return `
        display: none;
      `;
    }
    
    return 'display: none;';
  }}
`;

const ContentContainer = styled.div<{ stage: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  opacity: ${props => props.stage >= 1 ? 1 : 0};
  transition: opacity 0.5s ease-in-out, clip-path 0.8s ease-in-out;
  overflow: hidden;
  
  ${props => {
    const stage = props.stage;
    
    if (stage === 1) {
      return `
        clip-path: circle(30px at 75% 20%);
      `;
    }
    if (stage === 2) {
      return `
        clip-path: circle(30px at 50% 60%);
      `;
    }
    if (stage === 3) {
      return `
        clip-path: circle(100px at 75% 75%);
      `;
    }
    if (stage === 4) {
      return `
        clip-path: circle(150px at 50% 50%);
      `;
    }
    if (stage === 5) {
      return `
        clip-path: circle(200px at 50% 50%);
      `;
    }
    if (stage === 6) {
      return `
        clip-path: circle(250px at 50% 50%);
      `;
    }
    if (stage === 7) {
      return `
        clip-path: circle(45% at 50% 50%);
      `;
    }
    if (stage >= 8) {
      return `
        clip-path: none;
      `;
    }
    return 'clip-path: none;';
  }}
`;

const LogoIcon = styled.div<{ stage: number }>`
  opacity: ${props => props.stage >= 2 ? 1 : 0};
  transform: ${props => props.stage >= 2 ? 'scale(1)' : 'scale(0.8)'};
  transition: all 0.6s ease-out;
  animation: ${props => props.stage >= 2 ? slideUp : 'none'} 0.6s ease-out;
`;

const TitleContainer = styled.div<{ stage: number }>`
  opacity: ${props => props.stage >= 2 ? 1 : 0};
  transform: ${props => props.stage >= 2 ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.6s ease-out 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    max-width: 221px;
    height: auto;
  }
  
  @media (max-width: 768px) {
    svg {
      max-width: 180px;
    }
  }
`;

const SpeakCheckSplash: React.FC = () => {
  const [stage, setStage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 0);
    
    const timer2 = setTimeout(() => setStage(2), 800);
    
    const timer3 = setTimeout(() => setStage(3), 1600);
    
    const timer4 = setTimeout(() => setStage(4), 2400);
    
    const timer5 = setTimeout(() => setStage(5), 3200);
    
    const timer6 = setTimeout(() => setStage(6), 4000);
    
    const timer7 = setTimeout(() => setStage(7), 4800);
    
    const timer8 = setTimeout(() => setStage(8), 5600);
    
    const timer9 = setTimeout(() => setStage(9), 6400);
    
    const timer10 = setTimeout(() => setStage(10), 7200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
      clearTimeout(timer8);
      clearTimeout(timer9);
      clearTimeout(timer10);
    };
  }, []);

  const handleClick = () => {
    if (stage >= 10) {
      router.push('/login');
    }
  };

  return (
    <SplashPage stage={stage} onClick={handleClick}>
      <SplashContainer stage={stage}>
        {stage >= 1 && <Circle stage={stage} />}
        
        <ContentContainer stage={stage}>
          <LogoIcon stage={stage}>
            <Logo width={60} height={66} />
          </LogoIcon>
          <TitleContainer stage={stage}>
            <Title />
          </TitleContainer>
        </ContentContainer>
      </SplashContainer>
    </SplashPage>
  );
};

export default SpeakCheckSplash;


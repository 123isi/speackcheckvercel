"use client";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import styled from "@emotion/styled";
import { useRouter, useSearchParams } from "next/navigation";
import { Front } from "../../../public/svg";

interface DataCardProps {
  scores?: {
    [key: string]: number;
  };
}

export default function DataCard({ scores }: DataCardProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const stageId = searchParams?.get("stageId") || null;
    const presentationId = searchParams?.get("presentationId") || null;

    const seeData = scores?.['시각자료구성'] || 0;
    const contentData = scores?.['내용구성'] || 0;

    return (
      <Section>
        <Title 
          role="button" 
          onClick={() => router.push(`/newpt/result/detail?stageId=${encodeURIComponent(stageId ?? "")}&presentationId=${encodeURIComponent(presentationId ?? "")}&title=${encodeURIComponent('자료완성도')}`)}
          style={{ cursor: 'pointer' }}
        >
          자료 완성도
        </Title>
        <ItemsGrid>
          <SmallCard role="button" onClick={() => router.push(`/newpt/result/detail?stageId=${encodeURIComponent(stageId ?? "")}&presentationId=${encodeURIComponent(presentationId ?? "")}&title=${encodeURIComponent('시각자료 활용')}&score=${encodeURIComponent(seeData + '점')}`)}>
            <SmallHeader>
              <SmallLabel>시각자료 활용</SmallLabel>
              <SmallIcon>
                <Front width={12} height={12} />
              </SmallIcon>
            </SmallHeader>
            <Score>
              <ScoreNumber>{seeData}</ScoreNumber>점
            </Score>
          </SmallCard>
          <SmallCard role="button" onClick={() => router.push(`/newpt/result/detail?stageId=${encodeURIComponent(stageId ?? "")}&presentationId=${encodeURIComponent(presentationId ?? "")}&title=${encodeURIComponent('내용 구성')}&score=${encodeURIComponent(contentData + '점')}`)}>
            <SmallHeader>
              <SmallLabel>내용구성</SmallLabel>
              <SmallIcon>
                <Front width={12} height={12} />
              </SmallIcon>
            </SmallHeader>
            <Score>
              <ScoreNumber>{contentData}</ScoreNumber>점
            </Score>
          </SmallCard>
        </ItemsGrid>
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

const ItemsGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const SmallCard = styled.div`
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 88px;
  box-shadow: ${color.shadow};
`;

const SmallHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SmallLabel = styled.span`
  font-family: ${font.caption};
  color: ${color.default};
`;

const SmallIcon = styled.span`
  display: inline-flex;
  
`;

const Score = styled.span`
  font-family: ${font.P1};
  color: ${color.default};
  display: inline-flex;
  align-self: flex-end;
  line-height: 24px;
  font-size: 18px;
`;

const ScoreNumber = styled.span`
  color: ${color.primary};
`;

const Title = styled.h2`
  font-family: ${font.P1};
  color: ${color.default};
  margin: 0;
  text-align: left;
  width: 100%;
`;
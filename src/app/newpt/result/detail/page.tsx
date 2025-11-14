"use client";

import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import BottomNavigationBar from "@/components/common/bottomnavigation";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Back } from "../../../../../public/svg";

function ResultDetailContent() {
  const router = useRouter();
  const params = useSearchParams();
  const title = params?.get("title") || "상세";
  const score = params?.get("score") || null;
  const stageId = params?.get("stageId") || null;
  const presentationId = params?.get("presentationId") || null;

  const presentationAttitudeItems = [
    {
      title: "시선처리",
      score: 71,
      pros:"청중을 바라볼때는 청중들을 똑바로 똑바로 바라보아 자신감있는 모습을 보임",
      cons:"발표자료에 시선이 오래 머무는 경향이 있음",
      solution:"더 많은 연습으로 내용을 완벽하게 숙지하여 발표자료를 덜 보도록 함",
    },
    {
      title: "제스처",
      score: 62,
      pros:"청중을 바라볼때는 청중들을 똑바로 똑바로 바라보아 자신감있는 모습을 보임",
      cons:"발표자료에 시선이 오래 머무는 경향이 있음",
      solution:"더 많은 연습으로 내용을 완벽하게 숙지하여 발표자료를 덜 보도록 함",
    },
    {
      title: "말의 속도",
      score: 60,
      pros:"청중을 바라볼때는 청중들을 똑바로 똑바로 바라보아 자신감있는 모습을 보임",
      cons:"발표자료에 시선이 오래 머무는 경향이 있음",
      solution:"더 많은 연습으로 내용을 완벽하게 숙지하여 발표자료를 덜 보도록 함",
    },
    {
      title: "억양",
      score: 68,
      pros:"청중을 바라볼때는 청중들을 똑바로 똑바로 바라보아 자신감있는 모습을 보임",
      cons:"발표자료에 시선이 오래 머무는 경향이 있음",
      solution:"더 많은 연습으로 내용을 완벽하게 숙지하여 발표자료를 덜 보도록 함",
    },
  ];

  const materialCompletenessItems = [
    {
      title: "시각자료 활용",
      score: 71,
      pros:"시각자료를 효과적으로 활용하여 이해도를 높였음",
      cons:"일부 슬라이드에서 시각자료가 부족함",
      solution:"더 많은 시각자료를 추가하여 내용을 시각적으로 표현하도록 함",
    },
    {
      title: "내용 구성",
      score: 62,
      pros:"논리적이고 체계적인 내용 구성이 잘 되어있음",
      cons:"일부 섹션 간 연결이 다소 부족함",
      solution:"섹션 간 전환을 더 자연스럽게 연결하는 내용을 추가함",
    },
  ];

  const isCategoryPage = title === "발표태도" || title === "자료완성도";
  const items = title === "발표태도" ? presentationAttitudeItems : materialCompletenessItems;
  
  const currentItem = [...presentationAttitudeItems, ...materialCompletenessItems].find(
    item => item.title === title
  );

  const getHeaderTitle = () => {
    if (isCategoryPage) {
      return title;
    }
    const isMaterialItem = materialCompletenessItems.some(item => item.title === title);
    if (isMaterialItem) {
      return "자료완성도";
    }
    return "발표 태도";
  };

  return (
    <Page>
      <MainContainer>
        <HeaderRow>
          <BackButton onClick={() => router.back()} aria-label="뒤로 가기">
            <Back width={24} height={24} />
          </BackButton>
          <HeaderTitle>{getHeaderTitle()}</HeaderTitle>
          <Spacer />
        </HeaderRow>

        {isCategoryPage ? (
          <ItemsList>
            {items.map((item, index) => (
              <ItemCard 
                key={index}
                role="button"
                onClick={() => router.push(`/newpt/result/detail?stageId=${encodeURIComponent(stageId ?? "")}&presentationId=${encodeURIComponent(presentationId ?? "")}&title=${encodeURIComponent(item.title)}&score=${encodeURIComponent(item.score + '점')}`)}
              >
                <ItemTitleRow>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemScore>{item.score}점</ItemScore>
                </ItemTitleRow>
              </ItemCard>
            ))}
          </ItemsList>
        ) : currentItem ? (
          <DetailContainer>
            <TitleSection>
              <TitleText>{title}</TitleText>
              {score && <ScoreText>{score}</ScoreText>}
            </TitleSection>
            
            <DetailCard>
              <DetailCardHeader>
                <DetailCardTitle style={{ color: color.primary }}>강점</DetailCardTitle>
              </DetailCardHeader>
              <DetailCardContent>{currentItem.pros}</DetailCardContent>
            </DetailCard>

            <DetailCard>
              <DetailCardHeader>
                <DetailCardTitle style={{ color: color.warning }}>문제점</DetailCardTitle>
              </DetailCardHeader>
              <DetailCardContent>{currentItem.cons}</DetailCardContent>
            </DetailCard>

            <DetailCard>
              <DetailCardHeader>
                <DetailCardTitle style={{ color: color.default }}>해결책</DetailCardTitle>
              </DetailCardHeader>
              <DetailCardContent>{currentItem.solution}</DetailCardContent>
            </DetailCard>
          </DetailContainer>
        ) : (
          <Card>
            <TitleRow>
              <TitleText>{title}</TitleText>
              {score && <ScoreText>{score}</ScoreText>}
            </TitleRow>
          </Card>
        )}
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

const Card = styled.div`
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

const TitleRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleText = styled.h1`
  font-family: ${font.H1};
  color: ${color.default};
  margin: 0;
  line-height: 40px;
`;

const ScoreText = styled.span`
  font-family: ${font.H2};
  color: ${color.primary};
  line-height: 32px;
`;

const ItemsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemCard = styled.div`
  width: 100%;
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  box-shadow: ${color.shadow};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${color.form_pressing};
  }
`;

const ItemTitleRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemTitle = styled.h3`
  font-family: ${font.P1};
  color: ${color.default};
  margin: 0;
`;

const ItemScore = styled.span`
  font-family: ${font.P1};
  color: ${color.primary};
`;

const DetailContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
`;

const TitleSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

const DetailCard = styled.div`
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

const DetailCardHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const DetailCardTitle = styled.h3`
  font-family: ${font.P1};
  font-size: 18px;
  line-height: 24px;
  margin: 0;
`;

const DetailCardContent = styled.p`
  font-family: ${font.P2};
  color: ${color.default};
  margin: 0;
  line-height: 22px;
  white-space: pre-wrap;
`;

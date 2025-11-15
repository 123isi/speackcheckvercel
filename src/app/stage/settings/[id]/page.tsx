"use client";

import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import BottomNavigationBar from "@/components/common/bottomnavigation";
import IconMediumBtn from "@/components/button/IconMediumBtn";
import AnnounceCard from "@/components/card/AnnounceCard";
import AnnounceDelete from "@/components/modal/AnnounceDelete";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Plus, Back, Document } from "../../../../../public/svg";
import { getStageDetail } from "@/lib/stage";
import { deleteSpeech } from "@/lib/speech";
import { ApiError } from "@/lib/api";
import type { StageDetailResponse, SpeechItem } from "@/types/stage";

export default function StageDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const stageId = useMemo(() => params?.id, [params]);
  const [stageData, setStageData] = useState<StageDetailResponse | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSpeech, setSelectedSpeech] = useState<SpeechItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStageDetail = async () => {
    if (!stageId) return;

    try {
      setIsLoading(true);
      const data = await getStageDetail(stageId);
      setStageData(data);
    } catch (error) {
      console.error("Failed to load stage detail:", error);
      if (error instanceof ApiError && error.status === 401) {
        alert("로그인이 필요합니다.");
        router.push("/login");
      } else {
        alert("스테이지 정보를 불러오는데 실패했습니다.");
        router.back();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStageDetail();
  }, [stageId]);

  return (
    <Page>
      <MainContainer>
        <TopRow>
          <BackButton onClick={() => router.back()} aria-label="뒤로 가기">
            <Back width={24} height={24} />
          </BackButton>

          <TopActions>
            <IconMediumBtn
              width={120}
              icon={<Plus width={24} height={24} color={color.form} />}
              onClick={() => router.push(`/newpt?stageId=${params?.id || ""}`)}
            >
              모의 발표
            </IconMediumBtn>
            <IconMediumBtn
              width={120}
              icon={<Document width={24} height={24} color={color.form} />}
              onClick={() => router.push(`/newpt?stageId=${params?.id || ""}`)}
            >
              종합 평가
            </IconMediumBtn>
          </TopActions>
        </TopRow>

        <SortBar>
          <SortActive>가나다순</SortActive>
          <SortDivider />
          <SortInactive>최신순</SortInactive>
        </SortBar>

        {stageData && <StageTitle>{stageData.stageName}</StageTitle>}

        {isLoading ? (
          <EmptyState>
            <EmptyText>로딩 중...</EmptyText>
          </EmptyState>
        ) : !stageData || stageData.speeches.length === 0 ? (
          <EmptyState>
            <EmptyText>
              아직 발표를
              <br />
              진행하지 않았어요
            </EmptyText>
          </EmptyState>
        ) : (
          <List>
            {stageData.speeches.map((speech) => (
              <AnnounceCard
                key={speech.speechId}
                title='test'
                createdAt=""
                onDelete={() => {
                  setSelectedSpeech(speech);
                  setIsDeleteOpen(true);
                }}
                onClick={() =>
                  router.push(
                    `/newpt/result?stageId=${stageId}&speechId=${speech.speechId}&title=${encodeURIComponent(speech.speechName)}`
                  )
                }
              />
            ))}
          </List>
        )}
      </MainContainer>

      <AnnounceDelete
        open={isDeleteOpen}
        title={selectedSpeech?.speechName}
        onConfirm={async () => {
          if (!selectedSpeech) return;

          try {
            await deleteSpeech(selectedSpeech.speechId);
            await loadStageDetail();
            setIsDeleteOpen(false);
            setSelectedSpeech(null);
          } catch (error) {
            console.error("Failed to delete speech:", error);
            alert("발표 삭제에 실패했습니다.");
          }
        }}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedSpeech(null);
        }}
      />

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
  gap: 32px;
  align-items: center;
  padding: 16px;
  width: 100%;
  max-width: 375px;
  margin-top: 16px;
`;

const TopRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${color.form_pressing};
  }
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SortBar = styled.div`
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
  height: 44px;
  width: 343px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
`;

const SortActive = styled.p`
  font-family: ${font.P2};
  color: ${color.primary};
  text-align: center;
  margin: 0;
`;

const SortInactive = styled.p`
  font-family: ${font.P2};
  color: ${color.default};
  text-align: center;
  margin: 0;
`;

const SortDivider = styled.div`
  width: 1px;
  height: 22px;
  background-color: ${color.stroke};
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const EmptyText = styled.div`
  font-family: ${font.H1};
  color: ${color.primary};
  text-align: center;
  line-height: 40px;
  margin: 0;
`;

const StageTitle = styled.h2`
  font-family: ${font.H1};
  color: ${color.primary};
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  width: 100%;
  text-align: center;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  flex: 1;
  overflow-y: auto;
`;


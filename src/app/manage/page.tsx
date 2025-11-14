"use client";

import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import BottomNavigationBar from "@/components/common/bottomnavigation";
import StageCard from "@/components/card/StageCard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStageList, deleteStage } from "@/lib/stage";
import { ApiError } from "@/lib/api";
import type { StageListItem } from "@/types/stage";

export default function Manage() {
  const [stages, setStages] = useState<StageListItem[]>([]);
  const [sortBy, setSortBy] = useState<"word" | "time">("time");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadStages = async () => {
    try {
      setIsLoading(true);
      const data = await getStageList(sortBy);
      setStages(data);
    } catch (error) {
      console.error("Failed to load stages:", error);
      if (error instanceof ApiError && error.status === 401) {
        alert("로그인이 필요합니다.");
        router.push("/login");
      } else {
        alert("스테이지 목록을 불러오는데 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStages();
  }, [sortBy]);

  const handleDeleteStage = async (stageId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteStage(stageId);
      await loadStages();
    } catch (error) {
      console.error("Failed to delete stage:", error);
      alert("스테이지 삭제에 실패했습니다.");
    }
  };

  const handleStageClick = (stageId: string) => {
    router.push(`/stage/settings/${stageId}`);
  };

  return (
    <ManagePage>
      <MainContainer>
        <SortContainer>
          <SortOption active={sortBy === "word"} onClick={() => setSortBy("word")}>
            가나다순
          </SortOption>
          <SortDivider />
          <SortOption active={sortBy === "time"} onClick={() => setSortBy("time")}>
            최신순
          </SortOption>
        </SortContainer>

        {isLoading ? (
          <EmptyState>
            <EmptyText>로딩 중...</EmptyText>
          </EmptyState>
        ) : stages.length === 0 ? (
          <EmptyState>
            <EmptyText>
              아직 발표를
              <br />
              진행하지 않았어요
            </EmptyText>
          </EmptyState>
        ) : (
          <StagesList>
            {stages.map((stage) => (
              <StageCard
                key={stage.stageId}
                title={stage.stageName}
                createdAt={stage.createdAt}
                onDelete={() => handleDeleteStage(stage.stageId)}
                onClick={() => handleStageClick(stage.stageId)}
              />
            ))}
          </StagesList>
        )}
      </MainContainer>

      <BottomNavigationBar />
    </ManagePage>
  );
}

const ManagePage = styled.div`
  background-color: ${color.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
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
  margin-top: 50px;
  padding-bottom: 100px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
    display: none;
  }
  
  &::-webkit-scrollbar-track {
    display: none;
  }
  
  &::-webkit-scrollbar-thumb {
    display: none;
  }
`;

const SortContainer = styled.div`
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

const SortOption = styled.p<{ active?: boolean }>`
  font-family: ${font.P2};
  color: ${(props) => (props.active ? color.primary : color.default)};
  text-align: center;
  margin: 0;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${color.primary};
  }
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

const StagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  flex: 1;
  overflow-y: auto;
`;
"use client";

import styled from "@emotion/styled";
import { useState } from "react";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import AnnounceDelete from "../modal/AnnounceDelete";
import { Mic, Delete } from "../../../public/svg";

interface AnnounceCardProps {
  title: string;
  createdAt: string;
  onDelete?: () => void;
  onClick?: () => void;
}

export default function AnnounceCard({ title, createdAt, onDelete, onClick }: AnnounceCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <CardContainer onClick={onClick}>
      <CardContent>
        <CardHeader>
          <MicIcon>
            <Mic width={44} height={44} />
          </MicIcon>
          <CardInfo>
            <CardTitle>{title}</CardTitle>
          </CardInfo>
        </CardHeader>
        <DeleteButton onClick={(e) => {
          e.stopPropagation();
          setDeleteOpen(true);
        }}>
          <Delete width={24} height={24} />
        </DeleteButton>
      </CardContent>
      <AnnounceDelete
        open={deleteOpen}
        title={title}
        onConfirm={() => {
          onDelete?.();
          setDeleteOpen(false);
        }}
        onCancel={() => setDeleteOpen(false)}
      />
    </CardContainer>
  );
}

const CardContainer = styled.div`
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 12px;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${color.primary};
    box-shadow: ${color.shadow};
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const MicIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const CardTitle = styled.h3`
  font-family: ${font.P1};
  color: ${color.default};
  margin: 0;
  font-size: 16px;
  line-height: 1.2;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  width: 24px;
  height: 24px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${color.form_pressing};
  }
`;

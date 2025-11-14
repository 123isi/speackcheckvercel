"use client";

import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import IconMediumBtn from "../button/IconMediumBtn";
import MediumButton from "@/components/button/MediumBtn";
import { Delete, Record } from "../../../public/svg";

interface StageDeleteProps {
  open: boolean;
  title?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function StageDelete({ open, title, onConfirm, onCancel }: StageDeleteProps) {
  if (!open) return null;

  return (
    <Overlay onClick={onCancel}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <HeaderIcon>
            <Record width={44} height={44} />
          </HeaderIcon>
          <DialogTitle>{title ?? "발표"}</DialogTitle>
        </HeaderRow>
        <DialogMessageWarning>삭제 하시겠습니까?</DialogMessageWarning>
        <Buttons>
          <IconMediumBtn width={96} icon={<Delete width={24} height={24} color={color.form} />} onClick={onConfirm}>
            삭제
          </IconMediumBtn>
          <MediumButton width={64} onClick={onCancel}>취소</MediumButton>
        </Buttons>
      </Dialog>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  width: 343px;
  background-color: ${color.form};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 12px;
  padding: 24px 20px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DialogTitle = styled.h3`
  margin: 0;
  font-family: ${font.D2};
  color: ${color.default};
`;

const DialogMessageWarning = styled.p`
  margin: 8px 0 0 0;
  font-family: ${font.D2};
  color: ${color.warning};
  text-align: center;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
`;

const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
`;

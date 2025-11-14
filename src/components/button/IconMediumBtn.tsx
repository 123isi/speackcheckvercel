import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";
import { Plus } from "../../../public/svg";

interface IconMediumBtnProps {
    width?: number | string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export default function IconMediumBtn({ 
    width = 100,
    icon = <Plus width={24} height={24} color={color.form}/>,
    children = "새 스테이지 생성",
    onClick,
    disabled = false
}: IconMediumBtnProps) {
    return (
        <Btn width={width} onClick={onClick} disabled={disabled}>
            {icon}
            <Text>{children}</Text>
        </Btn>
    )
}


const Btn = styled.button<{ width: number | string }>`
  background-color: ${color.primary};
  color: ${color.button};
  border: none;
  border-radius: 8px;
  height: 44px;
  width: ${props => typeof props.width === 'number' ? `${props.width}px` : props.width};
  font-family: ${font.P1};
  cursor: pointer;
  box-shadow: 0px 4px 10px 0px rgba(77, 84, 69, 0.2);
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover:not(:disabled) {
    background-color: ${color.primary_m10};
  }
  
  &:active:not(:disabled) {
    background-color: ${color.primary_p10};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Text = styled.span`
  font-family: ${font.P1};
  color: ${color.button};
`;


import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";

interface MediumButtonProps {
  width?: number | string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function MediumButton({
  width,
  onClick,
  children,
  disabled,
}: MediumButtonProps) {
  return (
    <MedButton width={width} onClick={onClick} disabled={disabled}>
      {children}
    </MedButton>
  );
}

const MedButton = styled.button<{ width?: number | string }>`
  background-color: ${color.primary};
  color: ${color.button};
  border: none;
  border-radius: 8px;
  height: 44px;
  width: ${(props) => {
    if (props.width === undefined) return "auto";
    if (typeof props.width === "number") return `${props.width}px`;
    return props.width;
  }};
  font-family: ${font.P1};
  cursor: pointer;
  box-shadow: ${color.shadow};
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


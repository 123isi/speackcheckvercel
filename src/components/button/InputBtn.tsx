import styled from "@emotion/styled";
import color from "@/packages/design-system/color";
import font from "@/packages/design-system/font";

interface InputBtnProps {
    width?: number | string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputBtn({ width, placeholder, value, onChange }: InputBtnProps) {
    return (
        <InputField width={width} placeholder={placeholder} value={value} onChange={onChange} />
    )
}

const InputField = styled.input<{ width?: number | string }>`
  background-color: ${color.input};
  color: ${color.default};
  border: 1px solid ${color.stroke_lighter};
  border-radius: 8px;
  height: 44px;
  width: ${props => {
    if (props.width === undefined) return 'auto';
    if (typeof props.width === 'number') return `${props.width}px`;
    return props.width;
  }};
  font-family: ${font.P2};
  cursor: text;
  padding: 0 16px;
  transition: background-color 0.2s ease;
  
  &::placeholder {
    color: ${color.caption};
  }

  &:focus {
    outline: none;
    border-color: ${color.primary};
  }
`;


import type { SVGProps } from "react";

interface BackProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

const Back = ({ color = "#2A2C2B", ...props }: BackProps) => (
  <svg
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.625 12L11.625 21M21.375 12H2.625H21.375ZM2.625 12L11.625 3L2.625 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Back;

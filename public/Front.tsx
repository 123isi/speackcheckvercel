import type { SVGProps } from "react";

interface FrontProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

const Front = ({ color = "#2A2C2B", ...props }: FrontProps) => (
  <svg
    {...props}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.6875 6L6.1875 1.5M1.3125 6L10.6875 6L1.3125 6ZM10.6875 6L6.1875 10.5L10.6875 6Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Front;

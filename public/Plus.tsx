import type { SVGProps } from "react";

interface PlusProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

const Plus = ({ color = "#2A2C2B", ...props }: PlusProps) => (
  <svg
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 12V21M3 12H12H3ZM21 12H12H21ZM12 12V3V12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Plus;

import type { SVGProps } from "react";

interface EyeProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

const Eye = ({ color = "#2A2C2B", ...props }: EyeProps) => (
  <svg
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.5 12.6875C7.5 6.1875 16.5 6.1875 19.5 12.6875M12 16.1875C10.8954 16.1875 10 15.2921 10 14.1875C10 13.0829 10.8954 12.1875 12 12.1875C13.1046 12.1875 14 13.0829 14 14.1875C14 15.2921 13.1046 16.1875 12 16.1875Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Eye;

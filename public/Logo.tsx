import type { SVGProps } from "react";

interface LogoProps extends SVGProps<SVGSVGElement> {}

const Logo = ({ ...props }: LogoProps) => (
  <svg
    {...props}
    width="75"
    height="83"
    viewBox="0 0 75 83"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M59.5292 42.4114L70.7457 53.5057L54.7948 68.2532L74.9915 68.2658L75 81.75H32.1091L0 49.9906L33.6066 16.75L70.5621 31.4987L59.5292 42.4114ZM43.9646 43.1477H33.6066V53.5057H43.9646V43.1477Z"
      fill="#8B71D2"
    />
  </svg>
);

export default Logo;

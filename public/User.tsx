import type { SVGProps } from "react";

interface UserProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

const User = ({ color = "#2A2C2B", ...props }: UserProps) => (
  <svg
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 12C14.7614 12 17 9.76138 17 7C17 4.23857 14.7614 2 12 2C9.23857 2 7 4.23857 7 7C7 9.76138 9.23857 12 12 12ZM12 12C7.16751 12 3.25 15.9175 3.25 20.75V22M12 12C16.8325 12 20.75 15.9175 20.75 20.75V22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default User;

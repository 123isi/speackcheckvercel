import type { SVGProps } from "react";

interface RecordProps extends SVGProps<SVGSVGElement> {
  color?: string;
  fillColor?: string;
  primaryColor?: string;
}

const Record = ({ color = "#2A2C2B", fillColor = "#FAFDF7", primaryColor = "#8B71D2", ...props }: RecordProps) => (
<svg {...props} width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M35 12H17L6 20.5V30H20.5H35V25.5L40.5 31V11L35 16.5V12Z" fill={fillColor}/>
<path d="M40.5 11L35 16.5V12H17L6 20.5V30H20.5M40.5 31L35 25.5V30H20.5M20.5 30L28.0056 43M20.5 30L12.9944 43" stroke={color}/>
<circle cx="18" cy="10" r="7" fill={primaryColor} stroke={color}/>
<circle cx="24.5" cy="21.5" r="3.5" fill={primaryColor}/>
<path d="M11 10L5 15.5" stroke={color}/>
<circle cx="5.5" cy="20.5" r="5" fill={primaryColor} stroke={color}/>
<rect x="14" y="21" width="19" height="5" fill={primaryColor}/>
</svg>

);

export default Record;

import type { SVGProps } from "react";

interface UploadProps extends SVGProps<SVGSVGElement> {
  color?: string;
  fillColor?: string;
  primaryColor?: string;
}

const Upload = ({ color = "#2A2C2B", fillColor = "#FCFDFC", primaryColor = "#8B71D2", ...props }: UploadProps) => (
<svg {...props} width="75" height="56" viewBox="0 0 75 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M37.4754 4.52728L60.6577 10.7389L73.4064 14.1257L70.1726 26.2294L62.5375 54.7242L44.5713 49.9102L26.605 45.0962L37.4754 4.52728Z" fill={fillColor} stroke={color}/>
<path d="M0.612367 14.1553L23.7946 7.94368L36.5288 4.50233L39.78 16.6013L47.4152 45.0961L29.449 49.9102L11.4828 54.7242L0.612367 14.1553Z" fill={fillColor} stroke={color}/>
<path d="M19.6051 0.5H43.6051V13H56.8051V42.5H38.2051H19.6051V0.5Z" fill={fillColor}/>
<path d="M43.6051 0.5V13H56.8051L43.6051 0.5Z" fill={primaryColor}/>
<path d="M43.6051 0.5H19.6051V42.5H38.2051H56.8051V13M43.6051 0.5V13H56.8051M43.6051 0.5L56.8051 13M38.2051 18L30.7051 25.5M38.2051 18L45.7051 25.5M38.2051 18V35" stroke={color}/>
</svg>

);

export default Upload;

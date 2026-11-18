import React from 'react';
import { siWhatsapp } from 'simple-icons';

interface WhatsAppIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
}

/**
 * Official WhatsApp icon component using simple-icons brand vector data.
 */
export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({
  size = 16,
  className = '',
  color,
  style,
  ...props
}) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color || 'currentColor'}
      className={`shrink-0 ${className}`}
      style={style}
      aria-hidden="true"
      {...props}
    >
      <path d={siWhatsapp.path} />
    </svg>
  );
};

export default WhatsAppIcon;

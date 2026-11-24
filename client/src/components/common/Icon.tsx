import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

export type IconName =
  | 'House'
  | 'WalletCards'
  | 'ArrowLeftRight'
  | 'ArrowUpRight'
  | 'Users'
  | 'CreditCard'
  | 'FileText'
  | 'ReceiptText'
  | 'Landmark'
  | 'ChartNoAxesCombined'
  | 'ChartPie'
  | 'ShieldCheck'
  | 'Gift'
  | 'Bell'
  | 'CircleUserRound'
  | 'Settings'
  | 'Shield'
  | 'LockKeyhole'
  | 'KeyRound'
  | 'RotateCcw'
  | 'Fingerprint'
  | 'Smartphone'
  | 'Headset'
  | 'CircleHelp'
  | 'Search'
  | 'Download'
  | 'LogOut'
  | 'Pencil'
  | 'Trash2'
  | 'Eye'
  | 'EyeOff'
  | 'CircleCheck'
  | 'CircleAlert'
  | 'TriangleAlert'
  | 'CalendarDays'
  | 'ContactRound'
  | 'Gauge'
  | 'Snowflake'
  | 'LockOpen'
  | 'Globe'
  | 'Building2'
  | 'Receipt'
  | 'ClipboardCheck';

export type IconSizePreset = 'bottomNav' | 'sidebar' | 'quickAction' | 'header' | 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<IconSizePreset, number> = {
  bottomNav: 22,
  sidebar: 20,
  quickAction: 23,
  header: 22,
  sm: 16,
  md: 18,
  lg: 24,
};

export interface IconProps extends Omit<LucideProps, 'size'> {
  name: IconName | string;
  size?: IconSizePreset | number;
  strokeWidth?: number;
  title?: string;
  ariaLabel?: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  strokeWidth = 1.8,
  title,
  ariaLabel,
  className = '',
  ...props
}) => {
  const IconComponent = (LucideIcons as unknown as Record<string, React.FC<LucideProps>>)[name] || LucideIcons.CircleHelp;
  const computedSize = typeof size === 'string' ? SIZE_MAP[size] ?? 20 : size;

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
      title={title}
      aria-label={ariaLabel || title}
      role={ariaLabel || title ? 'img' : undefined}
    >
      <IconComponent
        size={computedSize}
        strokeWidth={strokeWidth}
        aria-hidden={!ariaLabel && !title}
        {...props}
      />
    </span>
  );
};

export default Icon;

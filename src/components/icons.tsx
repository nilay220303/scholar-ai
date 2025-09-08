import type { LucideProps } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export const Icons = {
  logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
      <rect width="256" height="256" fill="none" />
      <path
        d="M32,224s32-48,96-48,96,48,96,48"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M32,136H224a0,0,0,0,1,0,0V200a24,24,0,0,1-24,24H56a24,24,0,0,1-24-24Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M208,136V48a16,16,0,0,0-16-16H64A16,16,0,0,0,48,48v88"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  ),
  spinner: (props: LucideProps) => (
    <Loader2 {...props} className="animate-spin" />
  ),
};

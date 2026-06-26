const Logo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#10B981" />
    <path d="M30 55 C25 45, 30 35, 50 30 C70 25, 80 35, 75 50 C70 65, 50 70, 35 65" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
    <circle cx="50" cy="45" r="8" fill="#F97316" />
    <path d="M40 70 Q50 60 60 70" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

export default Logo;

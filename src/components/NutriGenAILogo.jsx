const NutriGenAILogo = ({ width = 280 }) => (
  <svg
    width={width}
    viewBox="0 0 600 260"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Bowl */}
    <path
      d="M170 110c0-35 40-60 90-60s90 25 90 60v15h25v20H145v-20h25z"
      fill="none"
      stroke="#F59E0B"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Bowl base */}
    <path
      d="M165 145h190c0 40-35 65-95 65s-95-25-95-65z"
      fill="none"
      stroke="#F59E0B"
      strokeWidth="14"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Chopsticks */}
    <line x1="320" y1="40" x2="420" y2="120" stroke="#F59E0B" strokeWidth="14" />
    <line x1="350" y1="35" x2="445" y2="105" stroke="#F59E0B" strokeWidth="14" />

    {/* Leaf */}
    <path
      d="M200 55c-35-30-70-20-85 5 25 10 45 35 85 30z"
      fill="#15803D"
    />

    {/* Brand Name */}
    <text
      x="300"
      y="245"
      textAnchor="middle"
      fontSize="48"
      fontWeight="800"
      fill="#111827"
      fontFamily="Poppins, Arial, sans-serif"
    >
      NutriGen AI
    </text>

    {/* Tagline */}
    <text
      x="300"
      y="275"
      textAnchor="middle"
      fontSize="20"
      fill="#374151"
      fontFamily="Poppins, Arial, sans-serif"
    >
      Smart Nutrition. Smarter Cooking.
    </text>
  </svg>
);

export default NutriGenAILogo;

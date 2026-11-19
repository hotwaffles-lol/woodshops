export default function Chevron({ isUp }) {
  return (
    <svg
      className="chevron"
      data-up={isUp}
      width="10"
      height="10"
      viewBox="0 0 9 9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1.5 3l3 3 3-3" />
    </svg>
  );
}

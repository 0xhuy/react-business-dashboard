type Props = {
  className?: string;
};

const IconDropdownHeader = ({ className }: Props) => (
  <svg
    className={className}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M11.25 8.25 9 10.5 6.75 8.25"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="9"
      cy="9"
      r="6.75"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);

export default IconDropdownHeader;

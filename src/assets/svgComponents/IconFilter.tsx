type Props = {
  strokePath?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
};

const IconFilter = (props: Props) => {
  // ===== Props =====
  const {
    strokePath = "currentColor",
    width = 20,
    height = 20,
    className,
  } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3.33325 8.33341C3.33325 8.77544 3.50885 9.19937 3.82141 9.51193C4.13397 9.82449 4.55789 10.0001 4.99992 10.0001C5.44195 10.0001 5.86587 9.82449 6.17843 9.51193C6.49099 9.19937 6.66659 8.77544 6.66659 8.33341C6.66659 7.89139 6.49099 7.46746 6.17843 7.1549C5.86587 6.84234 5.44195 6.66675 4.99992 6.66675C4.55789 6.66675 4.13397 6.84234 3.82141 7.1549C3.50885 7.46746 3.33325 7.89139 3.33325 8.33341Z"
        stroke={strokePath}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 3.33325V6.66659"
        stroke={strokePath}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 10V16.6667"
        stroke={strokePath}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8.33325 13.3334C8.33325 13.7754 8.50885 14.1994 8.82141 14.5119C9.13397 14.8245 9.55789 15.0001 9.99992 15.0001C10.4419 15.0001 10.8659 14.8245 11.1784 14.5119C11.491 14.1994 11.6666 13.7754 11.6666 13.3334C11.6666 12.8914 11.491 12.4675 11.1784 12.1549C10.8659 11.8423 10.4419 11.6667 9.99992 11.6667C9.55789 11.6667 9.13397 11.8423 8.82141 12.1549C8.50885 12.4675 8.33325 12.8914 8.33325 13.3334Z"
        stroke={strokePath}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M10 3.33325V11.6666"
        stroke={strokePath}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M10 15V16.6667"
        stroke={strokePath}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M13.3333 5.83341C13.3333 6.27544 13.5088 6.69937 13.8214 7.01193C14.134 7.32449 14.5579 7.50008 14.9999 7.50008C15.4419 7.50008 15.8659 7.32449 16.1784 7.01193C16.491 6.69937 16.6666 6.27544 16.6666 5.83341C16.6666 5.39139 16.491 4.96746 16.1784 4.6549C15.8659 4.34234 15.4419 4.16675 14.9999 4.16675C14.5579 4.16675 14.134 4.34234 13.8214 4.6549C13.5088 4.96746 13.3333 5.39139 13.3333 5.83341Z"
        stroke={strokePath}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M15 3.33325V4.16659"
        stroke={strokePath}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M15 7.5V16.6667"
        stroke={strokePath}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconFilter;

import * as React from "react";
const CrossIcon = (props) => (
  <svg
    width={65}
    height={64}
    viewBox="0 0 65 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M24.9533 39.5467L40.0466 24.4533"
      stroke={props.strokeColor || "white"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M40.0466 39.5467L24.9533 24.4533"
      stroke={props.strokeColor || "white"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* <path
      d="M24.5 58.6667H40.5C53.8333 58.6667 59.1666 53.3333 59.1666 40V24C59.1666 10.6667 53.8333 5.33334 40.5 5.33334H24.5C11.1666 5.33334 5.83331 10.6667 5.83331 24V40C5.83331 53.3333 11.1666 58.6667 24.5 58.6667Z"
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    /> */}
  </svg>
);
export default CrossIcon;

import React from "react";
import { StyledButton } from "./styles/StyledButton";

const StartButton = ({ callback, text }) => {
  const handleClick = () => {
    callback();
  };
  return <StyledButton onClick={handleClick}>{text}</StyledButton>;
};

export default StartButton;

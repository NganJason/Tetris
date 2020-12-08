import React from "react";
import { StyledCell } from "./styles/StyledCell";
import { TETROMINOS } from "../tetriminos";

const Cell = ({ type }) => {
  return <StyledCell type={type} color={TETROMINOS[type].color}></StyledCell>;
};

export default React.memo(Cell);

import styled from "styled-components";

export const StyledDisplay = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border: 4px solid #333;
  margin: 0px 0px 20px 0;
  padding: 20px;
  min-height: 30px;
  width: 100%;
  border-radius: 20px;
  background: #000;
  font-family: pixel;
  color: ${(props) => (props.gameOver ? "red" : "#999")};
  font-size: 0.8rem;
`;

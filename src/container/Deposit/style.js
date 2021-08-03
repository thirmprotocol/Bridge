import styled from "styled-components";

export const DepositWrapper = styled.div`
  position: relative;
  overflow: hidden;
  min-height: 470px;
  padding: 0;
  .next-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    margin: 0;
  }
  @media screen and (max-width: 375px) {
    min-height: 420px;
  }
`;

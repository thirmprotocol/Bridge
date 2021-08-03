import { AppBar, Card } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import styled from "styled-components";

export const MainWrapper = styled.div`
  margin: auto 0px;
`;

export const MainCard = styled(Card)`
  width: 100%;
`;

export const MainAppBar = styled(AppBar)`
  background-image: linear-gradient(to right, #0652dd 30%, #d43f8d 100%);
  &.change {
    background-image: linear-gradient(to left, #0652dd 30%, #d43f8d 100%);
  }

  .MuiTabs-flexContainer {
    height: 60px;
  }

  .MuiTab-wrapper {
    letter-spacing: 0.06em;
    font-weight: 500;
  }
`;

export const MainAlert = styled(Alert)`
  margin: 16px 0;
  text-align: center;
`;

export const External = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 16px 0;
`;

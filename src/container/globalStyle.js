import { List, ListItem, Stepper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import styled from "styled-components";

export const bridgeTheme = {
  primaryColor: "#0652DD",
  secondaryColor: "#e74c3c",
  darkBlue: "#30336b",
};

export const StyledButton = styled(Button)`
  height: 60px;
  margin: 16px 0;
  background-image: linear-gradient(
    to right,
    #0652dd 0%,
    #512da8 51%,
    #673ab7 100%
  );
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 6px;
  &:hover {
    background-position: right center;
    color: #fff;
    text-decoration: none;
  }

  &.Mui-disabled {
    background-image: none;
    background-color: #67e6d2;
  }

  span {
    margin-right: 4px;
  }
  svg {
    font-size: 32px;
  }

  .MuiCircularProgress-root {
    margin-right: 8px;
    color: #f1f1f1;
  }

  &.processing {
    background-color: #ff3cac;
    background-image: linear-gradient(
      225deg,
      #ff3cac 0%,
      #784ba0 50%,
      #2b86c5 100%
    );
  }
`;

export const StyledListItem = styled(ListItem)`
  margin: 8px 0;
  span.MuiListItemText-primary {
    font-weight: 500;
    @media screen and (max-width: 325px) {
      font-size: 0.75rem;
    }
    @media screen and (max-width: 375px) and (min-width: 325px) {
      font-size: 0.9rem;
    }
  }
`;

export const StyledList = styled(List)`
  margin: 24px 0;
  background: #f1f1f1;
  background: -webkit-linear-gradient(to right, #eef2f3, #f1f1f1);
  background: linear-gradient(to right, #eef2f3, #f1f1f1);
  border: 1px solid #e3e3e3;
  padding: 8px 0;
  border-radius: 5px;
`;

export const StyledInputArea = styled.div`
  margin: 24px 0;
  .MuiButton-label {
    color: ${bridgeTheme.primaryColor};
  }
`;

export const MainContentWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .list-title {
    font-size: 16px;
    text-align: center;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    display: table;
    margin: 36px auto 8px auto;
    padding-bottom: 4px;
    color: ${bridgeTheme.primaryColor};
  }

  .balance-info {
    text-align: center;
    color: #666;
    p {
      color: ${bridgeTheme.secondaryColor};
      font-weight: 500;
      font-size: 15px;
      margin: 6px 0;
    }
  }
  .top-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .action-area {
    padding: 36px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 320px;

    img {
      width: 120px;
      height: 120px;
      padding: 24px;
    }
    p {
      font-size: 18px;
      text-transform: uppercase;
    }

    .MuiAlert-root {
      font-size: 14px;
    }
    .qr-wrapper {
      margin-top: 48px;
      padding: 8px;
      margin-bottom: 16px;
    }
    .qr-wrapper-small {
      display: none;
      margin-top: 36px;
      padding: 8px;
      margin-bottom: 16px;
    }
    @media screen and (max-width: 375px) {
      .qr-wrapper {
        display: none;
      }
      .qr-wrapper-small {
        display: block;
      }
    }

    button {
      margin-top: 8px;
    }
    .completed-text {
      color: #6ab04c;
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    .error-text {
      color: #eb4d4b;
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 0.02em;
    }
  }
`;

export const GoBackButton = styled(Button)`
  margin-bottom: 16px;
  color: #555;
`;

export const StyledStepper = styled(Stepper)`
  margin: 24px 0;
  .MuiStepIcon-root.MuiStepIcon-active {
    color: ${bridgeTheme.darkBlue};
  }
  .MuiStepIcon-root.MuiStepIcon-completed {
    color: #6ab04c;
  }
  button {
    margin: 36px 0 24px 0;
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  margin: auto;
`;

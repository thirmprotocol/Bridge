/* eslint-disable react-hooks/exhaustive-deps */
import { Box, CardContent, Container, Tab, Tabs } from "@material-ui/core";
import React, { useEffect } from "react";
import Deposit from "./../Deposit/index";
import Withdraw from "./../Withdraw/index";
import { MainAlert, MainAppBar, MainCard, MainWrapper } from "./style";

import { useRecoilState } from "recoil";
import { useWeb3React } from "@web3-react/core";
import { tokensListState } from "../../utils/recoilState";
import { getTokens } from "./../../utils/index";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function MainPage() {
  const { library } = useWeb3React();
  const [tabValue, setTabValue] = React.useState(0);

  const [, setTokensList] = useRecoilState(tokensListState);

  useEffect(() => {
    let stale = false;
    const loadData = () => {
      const tokensListTemp = getTokens();
      console.log(tokensListTemp);
      if (!stale) {
        setTokensList(tokensListTemp);
      }
    };
    loadData();
    return () => {
      stale = true;
    };
  }, [library]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <MainWrapper>
      <Container maxWidth="xs">
        <MainAlert icon={false} severity="success" variant="outlined">
          ThirmVM is currently work in progress. Please don’t use assets you
          can’t afford to lose.
        </MainAlert>
        <MainCard elevation={5}>
          <MainAppBar
            position="static"
            elevation={0}
            className={tabValue === 1 && "change"}
          >
            <Tabs
              value={tabValue}
              indicatorColor="primary"
              onChange={handleTabChange}
              aria-label="THIRM function"
              centered
              variant="fullWidth"
            >
              <Tab label="Deposit" />
              <Tab label="Withdraw" disabled />
            </Tabs>
          </MainAppBar>
          <CardContent>
            <TabPanel value={tabValue} index={0}>
              <Deposit />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Withdraw />
            </TabPanel>
          </CardContent>
        </MainCard>
      </Container>
    </MainWrapper>
  );
}

export default MainPage;

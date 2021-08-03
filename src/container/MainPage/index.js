/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  CardContent,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import Deposit from "./../Deposit/index";
import Withdraw from "./../Withdraw/index";
import {
  External,
  MainAlert,
  MainAppBar,
  MainCard,
  MainWrapper,
} from "./style";

import { useRecoilState } from "recoil";
import { ensListState, tokensListState } from "../../utils/recoilState";
import { getEnsList, getTokens } from "../../utils";
import { useWeb3React } from "@web3-react/core";
import { ensState } from "./../../utils/recoilState";

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
  const [value, setValue] = React.useState(0);

  const [ens, setEns] = useRecoilState(ensState);
  const [, setTokensList] = useRecoilState(tokensListState);
  const [ensList, setEnsList] = useRecoilState(ensListState);

  useEffect(() => {
    let stale = false;
    const loadData = async () => {
      let tokensListTemp = await getTokens(library, ens);
      let ensListTemp = getEnsList();
      if (!stale) {
        setTokensList(tokensListTemp);
        setEnsList(ensListTemp);
      }
    };
    loadData();
    return () => {
      stale = true;
    };
  }, [library, ens]);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange = (prop) => (event) => {
    if (prop === "ens") setEns(event.target.value);
  };

  return (
    <MainWrapper>
      <Container maxWidth="xs">
        <External>
          <FormControl variant="outlined">
            <Select value={ens} onChange={handleChange("ens")}>
              {ensList.map((ens) => (
                <MenuItem value={ens} key={ens}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Typography style={{ marginLeft: 8, marginRight: 8 }}>
                      {ens.toUpperCase()}
                    </Typography>
                  </Grid>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </External>
        <MainCard elevation={5}>
          <MainAppBar
            position="static"
            elevation={0}
            className={value === 1 && "change"}
          >
            <Tabs
              value={value}
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
            <TabPanel value={value} index={0}>
              <Deposit />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Withdraw />
            </TabPanel>
          </CardContent>
        </MainCard>
        <MainAlert icon={false} severity="success" variant="outlined">
          ThirmVM is currently work in progress. Please don’t use assets you
          can’t afford to lose.
        </MainAlert>
      </Container>
    </MainWrapper>
  );
}

export default MainPage;

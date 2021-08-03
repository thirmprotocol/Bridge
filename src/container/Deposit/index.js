/* eslint-disable react-hooks/exhaustive-deps */
import {
  Avatar,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { KeyboardArrowLeft, TrendingFlat } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import { useWeb3React } from "@web3-react/core";
import { formatEther } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import QRCode from "react-qr-code";
import { useRecoilState } from "recoil";
import LoadingImage from "../../assets/images/loading.gif";
import { useMappingContract, useThirmContract } from "../../hooks";
import { formatAddress } from "../../utils";

import {
  addressState,
  assetState,
  thirmBalState,
  tokensListState,
} from "./../../utils/recoilState";
import {
  GoBackButton,
  StyledButton,
  StyledInputArea,
  StyledList,
  StyledListItem,
} from "./../globalStyle";
import { DepositWrapper } from "./style";
import { LoadingWrapper } from "./../globalStyle";

function Deposit() {
  const [address, setAddress] = useRecoilState(addressState);

  const [asset, setAsset] = useRecoilState(assetState);

  const [currentStep, setCurrentStep] = useState(0);

  const { account, library } = useWeb3React();

  const [tokensList] = useRecoilState(tokensListState);

  const [thirmBal, setThirmBal] = useRecoilState(thirmBalState);

  const mappingContract = useMappingContract();

  const thirmContract = useThirmContract();

  const [processingIndicator, setProcessingIndicator] = useState(false);

  const [snackBar, setSnackBar] = useState({
    status: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    let stale = false;
    const getTokensList = async () => {
      const bal = await thirmContract.balanceOf(account);
      const tokenBal = formatEther(bal);

      if (!stale) {
        setThirmBal(tokenBal);
      }
    };
    getTokensList();
    return () => {
      stale = true;
    };
  }, [currentStep]);

  const handleChange = (prop) => (event) => {
    if (prop === "address") setAddress(event.target.value);
    if (prop === "asset") setAsset(event.target.value);
  };

  const onNext = async () => {
    if (!address) return;
    const addressToMap = address.trim();
    if (currentStep === 1) {
      try {
        const mappedAddress = await mappingContract.getAddressMap(addressToMap);
        if (mappedAddress !== "0x0000000000000000000000000000000000000000") {
          setCurrentStep(4);
        } else {
          setCurrentStep(2);
        }
      } catch (e) {
        console.log(e);
        setCurrentStep(1);
      }
      return;
    }

    setCurrentStep((prevStep) => prevStep + 1);
  };

  const onBack = () => {
    if (currentStep > 1) {
      setCurrentStep(1);
      return;
    }
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBar({
      status: false,
      type: "success",
      message: "",
    });
  };

  const mapCoin = async () => {
    if (processingIndicator) return;
    const addressToMap = address.trim();
    try {
      const withdrawed = await mappingContract.setAddressMap(addressToMap);

      setProcessingIndicator(true);
      library.once(withdrawed.hash, (done) => {
        if (done.status === 1) {
          setCurrentStep(4);
          setSnackBar({
            status: true,
            type: "success",
            message: `Address mapping completed.`,
          });
        } else {
          setSnackBar({
            status: true,
            type: "error",
            message: `Address mapping failed.`,
          });
        }
        setProcessingIndicator(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (Object.keys(tokensList).length === 0)
    return (
      <DepositWrapper>
        <LoadingWrapper>
          <Avatar
            src={LoadingImage}
            style={{
              width: 64,
              height: 64,
            }}
          />
        </LoadingWrapper>
      </DepositWrapper>
    );

  return (
    <DepositWrapper>
      <div className="top-bar">
        {currentStep === 0 ? (
          <div></div>
        ) : (
          <GoBackButton color="primary" onClick={onBack}>
            <KeyboardArrowLeft /> Go Back
          </GoBackButton>
        )}
        <div className="balance-info">
          <p>{parseFloat(thirmBal).toFixed(8)} THIRM</p>
        </div>
      </div>

      {currentStep === 0 && (
        <>
          <StyledInputArea>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-address">
                Your {asset.toUpperCase()} Address
              </InputLabel>
              <OutlinedInput
                value={address}
                onChange={handleChange("address")}
                id="outlined-adornment-address"
                labelWidth={160}
                endAdornment={
                  <>
                    <InputAdornment position="end">
                      <Button
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard
                              .readText()
                              .then((text) => setAddress(text));
                          }
                        }}
                      >
                        Paste
                      </Button>
                    </InputAdornment>
                  </>
                }
              />
            </FormControl>
          </StyledInputArea>

          <StyledList>
            <StyledListItem>
              <ListItemText primary="Asset" />
              <ListItemSecondaryAction>
                <FormControl variant="outlined">
                  <Select value={asset} onChange={handleChange("asset")}>
                    {Object.keys(tokensList).map((tkn) => (
                      <MenuItem value={tkn} key={tkn}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                        >
                          <Avatar
                            alt={`t${tkn.toUpperCase()}`}
                            src={tokensList[tkn].icon}
                            style={{
                              width: 24,
                              height: 24,
                            }}
                          />
                          <Typography
                            style={{ marginLeft: 16, marginRight: 16 }}
                          >
                            {tkn.toUpperCase()}
                          </Typography>
                        </Grid>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </StyledListItem>

            <StyledListItem>
              <ListItemText primary="Destination" />
              <ListItemSecondaryAction>
                {formatAddress(account)}
              </ListItemSecondaryAction>
            </StyledListItem>

            <StyledListItem>
              <ListItemText primary="You will Receive" />
              <ListItemSecondaryAction>
                <p>t{asset.toUpperCase()}</p>
              </ListItemSecondaryAction>
            </StyledListItem>
          </StyledList>

          <StyledButton
            className="next-button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={onNext}
            disabled={!address}
          >
            <span>Next</span>
            <TrendingFlat />
          </StyledButton>
        </>
      )}

      {currentStep === 1 && (
        <>
          <h5 className="list-title">Your Deposit Summary</h5>

          <StyledList>
            <StyledListItem>
              <ListItemText primary="Asset" />
              <ListItemSecondaryAction>
                {asset.toUpperCase()}
              </ListItemSecondaryAction>
            </StyledListItem>

            <StyledListItem>
              <ListItemText primary={`${asset.toUpperCase()} Address`} />
              <ListItemSecondaryAction>
                {formatAddress(address)}
              </ListItemSecondaryAction>
            </StyledListItem>

            <StyledListItem>
              <ListItemText primary="Destination" />
              <ListItemSecondaryAction>
                {formatAddress(account)}
              </ListItemSecondaryAction>
            </StyledListItem>

            <StyledListItem>
              <ListItemText primary="You will Receive" />
              <ListItemSecondaryAction>
                <p>t{asset.toUpperCase()}</p>
              </ListItemSecondaryAction>
            </StyledListItem>
          </StyledList>
          <StyledButton
            className="next-button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={onNext}
          >
            <span>Next</span>
            <TrendingFlat />
          </StyledButton>
        </>
      )}
      {currentStep === 2 && (
        <>
          <div className="action-area">
            <img src={tokensList[asset].icon} alt={asset} />
            <p>MAP MY {asset.toUpperCase()} ADDRESS</p>
          </div>
          <StyledButton
            className={`next-button ${processingIndicator && "processing"}`}
            fullWidth
            variant="contained"
            color="primary"
            onClick={mapCoin}
          >
            {processingIndicator && (
              <>
                <CircularProgress size={24} color="secondary" />
                Mapping..
              </>
            )}
            {!processingIndicator && <>Map {asset.toUpperCase()} address</>}
          </StyledButton>
        </>
      )}

      {currentStep === 3 && (
        <>
          <div className="action-area">
            <div className="qr-wrapper">
              <QRCode value={tokensList[asset].deposit} size={230} />
            </div>
            <div className="qr-wrapper-small">
              <QRCode value={tokensList[asset].deposit} size={160} />
            </div>
            <OutlinedInput
              value={tokensList[asset].deposit}
              id="outlined-adornment-address"
              fullWidth
            />
            <CopyToClipboard
              text={tokensList[asset].deposit}
              onCopy={() => {
                setSnackBar({
                  status: true,
                  type: "info",
                  message: `Deposit address copied.`,
                });
              }}
            >
              <Button>Copy Deposit Address</Button>
            </CopyToClipboard>
          </div>
        </>
      )}

      <Snackbar
        open={snackBar.status}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackBarClose} severity={snackBar.type}>
          {snackBar.message}
        </Alert>
      </Snackbar>
    </DepositWrapper>
  );
}

export default Deposit;

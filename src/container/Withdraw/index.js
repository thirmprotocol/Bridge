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
import { ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import LoadingImage from "../../assets/images/loading.gif";
import checkIcon from "../../assets/images/check.png";
import errorIcon from "../../assets/images/error.png";
import { useControllerContract } from "./../../hooks/index";
import config from "./../../utils/config/index";
import { formatAddress, getThirmTokenContract } from "./../../utils/index";
import {
  addressState,
  amountState,
  assetState,
  tokenBalState,
  tokensListState,
} from "./../../utils/recoilState";
import {
  GoBackButton,
  StyledButton,
  StyledInputArea,
  StyledList,
  StyledListItem,
} from "./../globalStyle";
import { WithdrawWrapper } from "./style";
import { LoadingWrapper } from "./../globalStyle";

const ALLOWANCE_LIMIT = ethers.BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

function Withdraw() {
  const [amount, setAmount] = useRecoilState(amountState);

  const [address, setAddress] = useRecoilState(addressState);

  const [asset, setAsset] = useRecoilState(assetState);

  const [currentStep, setCurrentStep] = useState(0);

  const [tokensList] = useRecoilState(tokensListState);

  const [snackBar, setSnackBar] = useState({
    status: false,
    type: "success",
    message: "",
  });

  const { account, library } = useWeb3React();

  const [processingIndicator, setProcessingIndicator] = useState(false);

  const controllerContract = useControllerContract();

  const [tokenBal, setTokenBal] = useRecoilState(tokenBalState);

  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const [transactionHash, setTransactionHash] = useState("");

  useEffect(() => {
    let stale = false;
    const getTokensList = async () => {
      if (tokensList.hasOwnProperty(asset)) {
        const tokenContract = getThirmTokenContract(
          library,
          account,
          tokensList[asset].contract
        );
        const bal = await tokenContract.balanceOf(account);
        const tokenBal = formatEther(bal);

        if (!stale) {
          setTokenBal(tokenBal);
        }
      }
    };
    getTokensList();
    return () => {
      stale = true;
    };
  }, [currentStep, tokensList, asset]);

  const handleChange = (prop) => (event) => {
    if (prop === "amount") setAmount(event.target.value);
    if (prop === "address") setAddress(event.target.value);
    if (prop === "asset") setAsset(event.target.value);
  };

  const onNext = async () => {
    if (!amount || !address || amount <= 0) return;

    if (currentStep === 1) {
      const tokenContract = getThirmTokenContract(
        library,
        account,
        tokensList[asset].contract
      );

      const tokenAllowance = await tokenContract.allowance(
        account,
        config.CONTROLLER_CONTRACT_ADDRESS
      );

      const bal = await tokenContract.balanceOf(account);

      if (!tokenAllowance.eq(0) && tokenAllowance.gte(bal)) {
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
      return;
    }

    setCurrentStep((prevStep) => prevStep + 1);
  };

  const withdrawCoin = async () => {
    if (processingIndicator) return;
    const addressToMap = address.trim();
    try {
      const tknAmount = parseEther(amount.trim());
      const withdrawed = await controllerContract.registerWithdrawal(
        asset.toUpperCase(),
        addressToMap,
        tknAmount
      );

      setProcessingIndicator(true);
      library.once(withdrawed.hash, (done) => {
        setTransactionHash(withdrawed.hash);
        if (done.status === 1) {
          setWithdrawSuccess(true);
          setSnackBar({
            status: true,
            type: "success",
            message: `${asset.toUpperCase()} withdraw completed.`,
          });
        } else {
          setWithdrawSuccess(false);
          setSnackBar({
            status: true,
            type: "error",
            message: `${asset.toUpperCase()} withdraw failed.`,
          });
        }
        setCurrentStep(4);
        setProcessingIndicator(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const approveCurrentToken = async () => {
    if (processingIndicator) return;
    try {
      const tokenContract = getThirmTokenContract(
        library,
        account,
        tokensList[asset].contract
      );

      const tokenAllowance = await tokenContract.allowance(
        account,
        config.CONTROLLER_CONTRACT_ADDRESS
      );

      const bal = await tokenContract.balanceOf(account);

      if (!tokenAllowance.eq(0) && tokenAllowance.gte(bal)) {
        setCurrentStep(3);
        return;
      }

      const approved = await tokenContract.approve(
        config.CONTROLLER_CONTRACT_ADDRESS,
        ALLOWANCE_LIMIT
      );

      setProcessingIndicator(true);
      library.once(approved.hash, (done) => {
        if (done.status === 1) {
          setCurrentStep(3);
          setSnackBar({
            status: true,
            type: "success",
            message: `t${asset.toUpperCase()} token approval completed.`,
          });
        } else {
          setSnackBar({
            status: true,
            type: "error",
            message: `t${asset.toUpperCase()} token approval failed.`,
          });
        }
        setProcessingIndicator(false);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const onBack = async () => {
    if (currentStep > 1) {
      if (currentStep === 4) {
        setCurrentStep(0);
      } else {
        setCurrentStep(1);
      }
      setTransactionHash("");
      setWithdrawSuccess(false);
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

  const onTokenMax = () => {
    setAmount(tokenBal);
  };

  if (Object.keys(tokensList).length === 0)
    return (
      <WithdrawWrapper>
        <LoadingWrapper>
          <Avatar
            src={LoadingImage}
            style={{
              width: 64,
              height: 64,
            }}
          />
        </LoadingWrapper>
      </WithdrawWrapper>
    );

  return (
    <WithdrawWrapper>
      <div className="top-bar">
        {currentStep === 0 ? (
          <div></div>
        ) : (
          <GoBackButton color="primary" onClick={onBack}>
            <KeyboardArrowLeft /> Go Back
          </GoBackButton>
        )}
        <div className="balance-info">
          <p>
            {parseFloat(tokenBal).toFixed(8)} t{asset.toUpperCase()}
          </p>
        </div>
      </div>
      {currentStep === 0 && (
        <>
          <StyledInputArea>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">
                Your {asset.toUpperCase()} Address
              </InputLabel>
              <OutlinedInput
                value={address}
                onChange={handleChange("address")}
                aria-describedby="outlined-amount-helper-text"
                labelWidth={160}
                id="outlined-adornment-address"
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
          <StyledInputArea>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">
                Amount
              </InputLabel>
              <OutlinedInput
                value={amount}
                onChange={handleChange("amount")}
                endAdornment={
                  <>
                    <InputAdornment position="end">
                      <Button onClick={onTokenMax}>MAX</Button>
                    </InputAdornment>
                    <InputAdornment position="end">
                      t{asset.toUpperCase()}
                    </InputAdornment>
                  </>
                }
                id="outlined-adornment-amount"
                labelWidth={70}
                type="number"
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
                            alt={`t${tkn}`}
                            src={tokensList[tkn].icon}
                            style={{
                              width: 24,
                              height: 24,
                            }}
                          />
                          <Typography
                            style={{ marginLeft: 16, marginRight: 16 }}
                          >
                            {`t${tkn.toUpperCase()}`}
                          </Typography>
                        </Grid>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </StyledListItem>

            <StyledListItem>
              <ListItemText primary="You will Receive" />
              <ListItemSecondaryAction>
                {parseFloat(0.999 * amount).toFixed(8)} {asset.toUpperCase()}
              </ListItemSecondaryAction>
            </StyledListItem>
          </StyledList>
          <StyledButton
            disabled={
              !amount ||
              !address ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > parseFloat(tokenBal)
            }
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

      {currentStep === 1 && (
        <>
          <h5 className="list-title">Your Withdraw Summary</h5>
          <StyledList>
            <StyledListItem>
              <ListItemText primary="Asset" />
              <ListItemSecondaryAction>
                {asset.toUpperCase()}
              </ListItemSecondaryAction>
            </StyledListItem>

            <StyledListItem>
              <ListItemText primary="Amount" />
              <ListItemSecondaryAction>
                {amount} {asset.toUpperCase()}
              </ListItemSecondaryAction>
            </StyledListItem>

            <StyledListItem>
              <ListItemText primary={`${asset.toUpperCase()} Address`} />
              <ListItemSecondaryAction>
                {formatAddress(address)}
              </ListItemSecondaryAction>
            </StyledListItem>

            <StyledListItem>
              <ListItemText primary="You will Receive" />
              <ListItemSecondaryAction>
                {parseFloat(0.999 * amount).toFixed(8)} {asset.toUpperCase()}
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
            <img src={tokensList[asset].icon} alt={asset.toUpperCase()} />
            <p>Approve {asset.toUpperCase()}</p>
          </div>

          <StyledButton
            className={`next-button ${processingIndicator && "processing"}`}
            fullWidth
            variant="contained"
            color="primary"
            onClick={approveCurrentToken}
          >
            {processingIndicator && (
              <>
                <CircularProgress size={24} color="secondary" />
                Approving..
              </>
            )}
            {!processingIndicator && <>Approve {asset.toUpperCase()}</>}
          </StyledButton>
        </>
      )}

      {currentStep === 3 && (
        <>
          <div className="action-area">
            <img src={tokensList[asset].icon} alt={asset.toUpperCase()} />
            <p>
              Withdraw {amount} {asset.toUpperCase()}
            </p>
          </div>

          <StyledButton
            className={`next-button ${processingIndicator && "processing"}`}
            fullWidth
            variant="contained"
            color="primary"
            onClick={withdrawCoin}
          >
            {processingIndicator && (
              <>
                <CircularProgress size={24} color="secondary" />
                Withdrawing..
              </>
            )}
            {!processingIndicator && <>Withdraw {asset.toUpperCase()}</>}
          </StyledButton>
        </>
      )}

      {currentStep === 4 && (
        <div className="action-area">
          {withdrawSuccess && (
            <>
              <img src={checkIcon} alt="done" />
              <p className="completed-text">Withdraw Completed</p>
            </>
          )}

          {!withdrawSuccess && (
            <>
              <img src={errorIcon} alt="done" />
              <p className="error-text">Withdraw Failed</p>
            </>
          )}
          <Button
            color="primary"
            target="_blank"
            href={`https://bscscan.com/tx/${transactionHash}`}
          >
            Check Transaction
          </Button>
          <GoBackButton color="primary" onClick={onBack}>
            Go Back
          </GoBackButton>
        </div>
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
    </WithdrawWrapper>
  );
}

export default Withdraw;

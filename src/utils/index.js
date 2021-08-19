import { Contract } from "@ethersproject/contracts";
import ttokensAbi from "../utils/abis/ttokens.json";
import config from "./config/index";

export const getThirmTokenContract = (library, account, address) => {
  return new Contract(
    address,
    ttokensAbi,
    library.getSigner(account).connectUnchecked()
  );
};

export const formatAddress = (address) => {
  return `${address.substr(0, 8)}...${address.substr(
    address.length - 4,
    address.length
  )}`;
};

export const getTokens = () => {
  const assets = config.assets;
  const ttokens = {};
  // TODO: Add tTokens address
  assets.forEach((a) => {
    ttokens[a] = {
      icon: `https://raw.githubusercontent.com/thirmprotocol/API/master/icons/${a}.png`,
      contract: "0xb526FD41360c98929006f3bDcBd16d55dE4b0069",
    };
  });
  return ttokens;
};

export const getEnsList = () => {
  return config.ens;
};

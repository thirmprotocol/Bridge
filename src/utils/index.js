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
  assets.forEach((a) => {
    ttokens[a] = {
      icon: `https://raw.githubusercontent.com/thirmprotocol/API/master/icons/${a}.png`,
      contract: "0x0000000000000000000000000000000000000000",
    };
  });
  return ttokens;
};

export const getEnsList = () => {
  return config.ens;
};

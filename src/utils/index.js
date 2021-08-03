import { Contract } from "@ethersproject/contracts";
import ttokensAbi from "../utils/abis/ttokens.json";

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
  const ttokens = {
    btc: {
      icon: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Bitcoin-BTC-icon.png",
      contract: "0xb526FD41360c98929006f3bDcBd16d55dE4b0069",
    },
    ltc: {
      icon: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Litecoin-LTC-icon.png",
      contract: "0xb526FD41360c98929006f3bDcBd16d55dE4b0069",
    },
    doge: {
      icon: "https://cdn.iconscout.com/icon/free/png-512/dogecoin-441958.png",
      contract: "0xb526FD41360c98929006f3bDcBd16d55dE4b0069",
    },
    nano: {
      icon: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Nano-icon.png",
      contract: "0xb526FD41360c98929006f3bDcBd16d55dE4b0069",
    },
    bch: {
      icon: "https://www.pngitem.com/pimgs/m/650-6504368_bitcoin-cash-bch-logo-hd-png-download.png",
      contract: "0xb526FD41360c98929006f3bDcBd16d55dE4b0069",
    },
  };
  return ttokens;
};

export const getEnsList = () => {
  return ["thirm.eth"];
};

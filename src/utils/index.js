import { Contract } from "@ethersproject/contracts";
import ENS, { getEnsAddress } from "@ensdomains/ensjs";
import ttokensAbi from "../utils/abis/ttokens.json";
import HttpProvider from "ethjs-provider-http";
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

export const getTokens = async (library, ens) => {
  const provider = new HttpProvider(config.RPC_URL);
  const ensLookup = new ENS({ provider, ensAddress: getEnsAddress("1") });

  try {
    const btcAddress = await ensLookup.name(ens).getAddress("BTC");
    const ltcAddress = await ensLookup.name(ens).getAddress("LTC");
    const dogeAddress = await ensLookup.name(ens).getAddress("DOGE");
    const nanoAddress = await ensLookup.name(ens).getAddress("NANO");
    const bchAddress = await ensLookup.name(ens).getAddress("BCH");

    const ttokens = {
      btc: {
        icon: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Bitcoin-BTC-icon.png",
        contract: "0xb526FD41360c98929006f3bDcBd16d55dE4b0069",
        deposit: btcAddress,
      },
      ltc: {
        icon: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Litecoin-LTC-icon.png",
        contract: "0xb526FD41360c98929006f3bDcBd16d55dE4b0069",
        deposit: ltcAddress,
      },
      doge: {
        icon: "https://cdn.iconscout.com/icon/free/png-512/dogecoin-441958.png",
        contract: "0xb526FD41360c98929006f3bDcBd16d55dE4b0069",
        deposit: dogeAddress,
      },
      nano: {
        icon: "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Nano-icon.png",
        contract: "0xb526FD41360c98929006f3bDcBd16d55dE4b0069",
        deposit: nanoAddress,
      },
      bch: {
        icon: "https://www.pngitem.com/pimgs/m/650-6504368_bitcoin-cash-bch-logo-hd-png-download.png",
        contract: "0xb526FD41360c98929006f3bDcBd16d55dE4b0069",
        deposit: bchAddress,
      },
    };
    return ttokens;
  } catch (e) {
    return {};
  }
};

export const getEnsList = () => {
  return ["thirm.eth"];
};

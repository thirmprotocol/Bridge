import { atom } from "recoil";

export const amountState = atom({
  key: "amount",
  default: "",
});

export const addressState = atom({
  key: "address",
  default: "",
});

export const assetState = atom({
  key: "asset",
  default: "btc",
});

export const thirmBalState = atom({
  key: "thirm",
  default: "0.00000000",
});

export const tokenBalState = atom({
  key: "token",
  default: "0.00000000",
});

export const ensListState = atom({
  key: "ensList",
  default: ["thirm.eth"],
});

export const ensState = atom({
  key: "ens",
  default: "thirm.eth",
});

export const tokensListState = atom({
  key: "tokensList",
  default: {},
});

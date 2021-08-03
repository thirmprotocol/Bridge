import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { injected } from "../../hooks/connectors";
import { useEagerConnect, useInactiveListener } from "../../hooks/index";
import ConnectWallet from "../WalletConnect/index";
import { LoadingWrapper } from "./../globalStyle";
import { Avatar } from "@material-ui/core";
import LoadingImage from "../../assets/images/loading.gif";

function Web3Wrapper({ children }) {
  const { connector, activate, active, chainId } = useWeb3React();

  // state for connectot activation
  const [activatingConnector, setActivatingConnector] = useState(true);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(false);
    } else {
      setTimeout(() => {
        if (!active) {
          setActivatingConnector(false);
        }
      }, 600);
    }
  }, [activatingConnector, active, connector, setActivatingConnector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  if (triedEager && active && chainId !== undefined) {
    return children;
  }

  if (activatingConnector) {
    return (
      <LoadingWrapper>
        <Avatar
          src={LoadingImage}
          style={{
            width: 64,
            height: 64,
          }}
        />
      </LoadingWrapper>
    );
  }

  return (
    <Switch>
      <Route
        exact
        path="/"
        component={() => (
          <ConnectWallet
            connectorsByName={{
              Injected: injected,
            }}
            activate={activate}
            setActivatingConnector={setActivatingConnector}
          />
        )}
      />
    </Switch>
  );
}

export default Web3Wrapper;

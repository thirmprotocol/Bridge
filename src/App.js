import { Web3Provider } from "@ethersproject/providers";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { Web3ReactProvider } from "@web3-react/core";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import MainContent from "./container/index";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const theme = createMuiTheme({
  typography: {
    fontFamily: "Kanit, Oxygen, Arial",
    fontSize: 15,
  },
  palette: {
    primary: {
      main: "#0652DD",
    },
    secondary: {
      main: "#e74c3c",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Router>
            <MainContent />
          </Router>
        </Web3ReactProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default App;

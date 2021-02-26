import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import Header from "./components/Header";
import Container from "./components/Container";
import { Container as C } from "@material-ui/core";
import ParticlesBg from "particles-bg";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";

const App = () => (
  <Router>
    <ThemeProvider theme={theme}>
      <ParticlesBg color="#d117e7" type="cobweb" bg={true} />
      <C maxWidth="lg">
        <Header />
        <Container />
      </C>
    </ThemeProvider>
  </Router>
);

render(<App />, document.getElementById("root"));

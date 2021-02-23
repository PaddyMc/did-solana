import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import Header from "./components/Header";
import Container from "./components/Container";

const App = () => (
  <Router>
    <Header />
    <Container />
  </Router>
);

render(<App />, document.getElementById("root"));

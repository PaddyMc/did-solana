import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./global-styles";
import reportWebVitals from "./reportWebVitals";

import Header from "./components/Header";
import Container from "./components/Container";

const App = () => (
  <Router>
    <div>
      <Header />
      <Container />
    </div>
  </Router>
);

render(<App />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

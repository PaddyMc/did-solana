import styled from "styled-components";
import { Switch, Route, withRouter } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import Home from "./Home";
import CreateDid from "./CreateDid";
import AddAuthentication from "./AddAuthentication";
import AddService from "./AddService";
import CreateService from "./CreateService";
import Info from "./Info";

const Container = ({ location }) => (
  <Wrapper>
    <TransitionGroup className="transition-group">
      <CSSTransition
        key={location.key}
        timeout={{ enter: 300, exit: 300 }}
        classNames="fade"
      >
        <section className="route-section">
          <Switch location={location}>
            <Route exact path="/" component={Home} />
            <Route exact path="/create-identifier" component={CreateDid} />
            <Route
              exact
              path="/add-authentication"
              component={AddAuthentication}
            />
            <Route exact path="/add-service" component={AddService} />
            <Route exact path="/create-service" component={CreateService} />
            <Route exact path="/info" component={Info} />
          </Switch>
        </section>
      </CSSTransition>
    </TransitionGroup>
  </Wrapper>
);

const Wrapper = styled.div`
  .fade-enter {
    opacity: 0.01;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 300ms ease-in;
  }

  .fade-exit {
    opacity: 1;
  }

  .fade-exit.fade-exit-active {
    opacity: 0.01;
    transition: opacity 300ms ease-in;
  }

  div.transition-group {
    position: relative;
  }

  section.route-section {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }
`;

export default withRouter(Container);

import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import "cross-fetch/polyfill";
import { connect } from "react-redux";
import PropTypes from "prop-types";

//Components
import Login from "../src/components/login/Login";
import Menu from "../src/components/Menu";

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

//Apollo client setup
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

class Index extends Component {
  render() {
    const { user } = this.props;
    return (
      <ApolloProvider client={client}>
        {!user ? <Login /> : <Menu />}
      </ApolloProvider>
    );
  }
}

Index.propTypes = {
  user: PropTypes.object
};

const WrappedComponent = connect(
  mapStateToProps,
  null
)(Index);

export default WrappedComponent;

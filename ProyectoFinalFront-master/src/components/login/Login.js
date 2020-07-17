import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import classNames from "classnames";
import { flowRight as compose } from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../redux/actions";

import { withStyles } from "@material-ui/core/styles";

import {
  getUserByEmailAndPasswordMutation,
  getBooksForSearchMutation
} from "../../queries/mutations";
import styles from "../../styles/Login";

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ ...actions }, dispatch);
};

class Login extends Component {
  async componentDidMount() {}
  state = { email: "", password: "" };

  validateForm = () => {
    const { email, password } = this.state;
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let errors = [];
    if (email.trim() === "" || password.trim() === "") {
      errors.push("Complete todos los campos");
    } else {
      !emailPattern.test(email.toLowerCase()) &&
        errors.push("Escriba un correo electrónico válido");
    }
    return errors;
  };
  async submitForm(e) {
    e.preventDefault();
    const errors = this.validateForm();
    let errorMessage = "Error\n\n";
    for (let i = 0; i < errors.length; i++) {
      errorMessage = errorMessage + errors[i] + "\n";
    }
    if (errors.length !== 0) {
      alert(errorMessage);
      return;
    }
    let result = await this.props.getUserByEmailAndPasswordMutation({
      variables: {
        email: this.state.email,
        password: this.state.password
      }
    });
    result = result.data.getUserByEmailAndPassword;
    if (result) {
      let booksForSearch = await this.props.getBooksForSearchMutation({
        variables: {
          userId: result.id
        }
      });
      booksForSearch = booksForSearch.data.getBooksForSearch;
      this.props.setBooksForSearch(booksForSearch);
      this.setState({ password: "", email: "" });
      this.props.setUser(result);
    } else {
      alert("¡Error! correo y/o contraseña invalidos");
    }
  }
  render() {
    const { classes, componentTitle } = this.props;
    return (
      <div className={classNames(classes.superCenter, classes.background)}>
        <div>
          <div
            className={classNames(classes.titleContainer, classes.superCenter)}
          >
            Iniciar Sesión
          </div>
          <form
            className={classNames(classes.back)}
            onSubmit={this.submitForm.bind(this)}
          >
            <div>
              <input
                placeholder="Correo electrónico"
                className={classes.input}
                type="text"
                required
                autoFocus
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </div>
            <div>
              <input
                placeholder="Contraseña"
                className={classes.input}
                type="password"
                required
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
              />
            </div>
            <div className={classes.superCenter}>
              <button className={classes.button}>Iniciar Sesión</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

const WrappedComponent = connect(null, mapDispatchToProps)(Login);

const ComposedComponent = compose(
  graphql(getUserByEmailAndPasswordMutation, {
    name: "getUserByEmailAndPasswordMutation"
  }),
  graphql(getBooksForSearchMutation, {
    name: "getBooksForSearchMutation"
  })
)(WrappedComponent);

export default withStyles(styles, { withTheme: true })(ComposedComponent);

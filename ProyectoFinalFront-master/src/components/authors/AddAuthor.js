import React, { Component } from "react";
import { graphql } from "react-apollo";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { flowRight as compose } from "lodash";

import {
  getAuthorsQuery,
  getAreaByRepresentativeId
} from "../../queries/queries";
import { addUserMutation } from "../../queries/mutations";
import styles from "../../styles/Add";

const mapStateToProps = state => {
  return {};
};

class AddAuthor extends Component {
  state = { firstName: "", lastName: "", areaId: "", email: "" };
  displayArea() {
    const data = this.props.getAreaByRepresentativeId;
    if (!data.loading) {
      return data.areaByRepresentativeId.name;
    }
  }
  validateForm = () => {
    const { firstName, lastName, email } = this.state;
    const onlyLettersPattern = /^[a-zA-Z]+( [a-zA-Z]+)*$/;
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let errors = [];
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === ""
    ) {
      errors.push("Complete todos los campos");
    } else {
      !onlyLettersPattern.test(firstName.trim()) &&
        errors.push("Escriba un nombre válido");
      !onlyLettersPattern.test(lastName.trim()) &&
        errors.push("Escriba un apellido válido");
      !emailPattern.test(email.toLowerCase().trim()) &&
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
    let result = await this.props.addUserMutation({
      variables: {
        firstName: this.state.firstName.trim(),
        lastName: this.state.lastName.trim(),
        areaId: this.props.getAreaByRepresentativeId.areaByRepresentativeId.id,
        email: this.state.email.trim(),
        userType: "Author",
        recordUserId: this.props.user.id
      },
      refetchQueries: [
        { query: getAuthorsQuery, variables: { id: this.props.user.id } }
      ]
    });
    result = result.data.addUser;
    if (result) {
      this.setState({
        firstName: "",
        lastName: "",
        areaId: "",
        email: ""
      });
      alert("Se ha creado un autor con éxito.");
    } else {
      alert("No se ha podido crear un autor.");
    }
  }
  render() {
    const { classes, componentTitle } = this.props;
    return (
      <div className={classes.superCenter}>
        <div>
          <div
            className={classNames(classes.titleContainer, classes.superCenter)}
          >
            {componentTitle}
          </div>
          <form
            className={classNames(classes.back)}
            onSubmit={this.submitForm.bind(this)}
          >
            <div>
              <input
                placeholder="Nombres"
                className={classes.input}
                type="text"
                required
                autoFocus
                value={this.state.firstName}
                onChange={e => this.setState({ firstName: e.target.value })}
              />
            </div>
            <div>
              <input
                placeholder="Apellidos"
                className={classes.input}
                type="text"
                required
                value={this.state.lastName}
                onChange={e => this.setState({ lastName: e.target.value })}
              />
            </div>
            <div className={classNames(classes.label, classes.superCenter)}>
              {this.displayArea()}
            </div>
            <div>
              <input
                placeholder="Correo electrónico"
                className={classes.input}
                type="text"
                required
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
              />
            </div>
            <div className={classes.superCenter}>
              <button className={classes.button}>Añadir autor</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

AddAuthor.propTypes = {
  classes: PropTypes.object.isRequired,
  componentTitle: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

const WrappedComponent = connect(mapStateToProps, null)(AddAuthor);

const ComposedComponent = compose(
  graphql(addUserMutation, { name: "addUserMutation" }),
  graphql(getAreaByRepresentativeId, {
    name: "getAreaByRepresentativeId",
    options: props => {
      return {
        variables: {
          id: props.user.id
        }
      };
    }
  })
)(WrappedComponent);

export default withStyles(styles)(ComposedComponent);

import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import classNames from "classnames";
import { flowRight as compose } from "lodash";

import { withStyles } from "@material-ui/core/styles";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import styles from "../../styles/modal/AuthorModal";

import { updateUserMutation } from "../../queries/mutations";
import { getAuthorsQuery } from "../../queries/queries";

class AuthorModal extends Component {
  state = {
    firstName: this.props.author.firstName,
    lastName: this.props.author.lastName,
    areaId: this.props.author.area.id,
    email: this.props.author.email,
    password: this.props.author.password
  };

  submitForm = async e => {
    const { author } = this.props;
    const { firstName, lastName, areaId, email, password } = this.state;
    e.preventDefault();
    let result = await this.props.updateUserMutation({
      variables: {
        id: author.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        areaId: areaId,
        email: email.trim(),
        password: password
      },
      refetchQueries: [
        { query: getAuthorsQuery, variables: { id: this.props.user.id } }
      ]
    });
    result = result.data.updateUser;
    alert("Se ha actualizado un autor con éxito.");
    this.props.closeModal();
  };
  render() {
    const { classes, open, author } = this.props;
    return (
      author && (
        <div>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={e => {
              this.props.closeModal();
            }}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500
            }}
          >
            <Fade in={open}>
              <div className={classes.paper}>
                <div className={classes.superCenter}>
                  <h2 id="transition-modal-title">Modificar Autor</h2>
                </div>
                <div>
                  <form
                    className={classNames(classes.back)}
                    onSubmit={this.submitForm.bind(this)}
                  >
                    <div>
                      <input
                        placeholder="Nombres"
                        value={this.state.firstName}
                        className={classes.input}
                        type="text"
                        required
                        autoFocus
                        onChange={e => {
                          this.setState({ firstName: e.target.value });
                        }}
                      ></input>
                    </div>
                    <div>
                      <input
                        placeholder="Apellidos"
                        value={this.state.lastName}
                        className={classes.input}
                        type="text"
                        required
                        onChange={e => {
                          this.setState({ lastName: e.target.value });
                        }}
                      ></input>
                    </div>
                    <div
                      className={classNames(classes.superCenter, classes.label)}
                    >
                      {this.props.author.area.name}
                    </div>
                    <div>
                      <input
                        placeholder="Correo electrónico"
                        value={this.state.email}
                        className={classes.input}
                        type="text"
                        required
                        onChange={e => {
                          this.setState({ email: e.target.value });
                        }}
                      ></input>
                    </div>
                    <div>
                      <input
                        placeholder="Contraseña"
                        value={this.state.password}
                        className={classes.input}
                        type="password"
                        required
                        onChange={e => {
                          this.setState({ password: e.target.value });
                        }}
                      ></input>
                    </div>
                    <div className={classes.superCenter}>
                      <button className={classes.button}>
                        Realizar cambios
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Fade>
          </Modal>
        </div>
      )
    );
  }
}

AuthorModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  author: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const ComposedComponent = compose(
  graphql(updateUserMutation, {
    name: "updateUserMutation"
  })
)(AuthorModal);

export default withStyles(styles, { withTheme: true })(ComposedComponent);

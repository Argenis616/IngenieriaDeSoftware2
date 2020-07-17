import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import classNames from "classnames";
import { flowRight as compose } from "lodash";

import { withStyles } from "@material-ui/core/styles";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import styles from "../../styles/RepresentativeModal";

import { updateUserMutation } from "../../queries/mutations";
import { getRepresentativesQuery, getAreasQuery } from "../../queries/queries";

class RepresentativeModal extends Component {
  state = {
    firstName: this.props.representative.firstName,
    lastName: this.props.representative.lastName,
    areaId: this.props.representative.area.id,
    email: this.props.representative.email,
    password: this.props.representative.password
  };

  displayAreas() {
    const data = this.props.getAreasQuery;

    if (!data.loading) {
      return data.areas.map(area => {
        return (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        );
      });
    }
  }

  submitForm = async e => {
    const { representative } = this.props;
    const { firstName, lastName, areaId, email, password } = this.state;
    e.preventDefault();
    let result = await this.props.updateUserMutation({
      variables: {
        id: representative.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        areaId: areaId,
        email: email.trim(),
        password: password
      },
      refetchQueries: [{ query: getRepresentativesQuery }]
    });
    result = result.data.updateUser;
    alert("Se ha actualizado un representante con éxito.");
    this.props.closeModal();
  };
  render() {
    const { classes, open, representative } = this.props;
    return (
      representative && (
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
                  <h2 id="transition-modal-title">Modificar Representante</h2>
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
                    <div>
                      <select
                        className={classNames(classes.input, classes.select)}
                        value={this.state.areaId}
                        onChange={e => {
                          this.setState({ areaId: e.target.value });
                        }}
                      >
                        <option value="default" disabled>
                          Seleccione un área
                        </option>
                        {this.displayAreas()}
                      </select>
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

RepresentativeModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  representative: PropTypes.object.isRequired
};

const ComposedComponent = compose(
  graphql(updateUserMutation, {
    name: "updateUserMutation"
  }),
  graphql(getAreasQuery, {
    name: "getAreasQuery"
  })
)(RepresentativeModal);

export default withStyles(styles, { withTheme: true })(ComposedComponent);

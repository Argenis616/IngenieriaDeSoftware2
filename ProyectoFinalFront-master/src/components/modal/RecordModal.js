import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import classNames from "classnames";
import { flowRight as compose } from "lodash";

import { withStyles } from "@material-ui/core/styles";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import styles from "../../styles/modal/RecordModal";

class RecordModal extends Component {
  state = {};

  render() {
    const { classes, open, record } = this.props;
    return (
      record && (
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
                  <h2 id="transition-modal-title">Detalles de la bitácora</h2>
                </div>
                <div>
                  <div className={classNames(classes.back)}>
                    <div>
                      <div
                        className={classNames(
                          classes.label,
                          classes.superCenter
                        )}
                      >
                        {record.user.firstName} {record.user.lastName}
                      </div>
                    </div>
                    <div>
                      <div
                        className={classNames(
                          classes.label,
                          classes.superCenter
                        )}
                      >
                        {record.user.userType === "Coordinator"
                          ? "Coordinador"
                          : "Representante"}
                      </div>
                    </div>
                    <div>
                      <div
                        className={classNames(
                          classes.label,
                          classes.superCenter
                        )}
                      >
                        {record.action}
                      </div>
                    </div>
                    <div>
                      <div
                        className={classNames(
                          classes.label,
                          classes.superCenter
                        )}
                      >
                        {record.date}
                      </div>
                    </div>
                    <div>
                      <div
                        className={classNames(
                          classes.label,
                          classes.superCenter
                        )}
                      >
                        {record.time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Fade>
          </Modal>
        </div>
      )
    );
  }
}

RecordModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  record: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(RecordModal);

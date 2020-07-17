import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import classNames from "classnames";
import { flowRight as compose } from "lodash";

import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";

import { connect } from "react-redux";

import styles from "../../styles/List";
import { getRecordsQuery } from "../../queries/queries";
import RecordModal from "../modal/RecordModal";

class Records extends Component {
  state = {
    open: false,
    selected: null
  };
  closeModal = () => {
    this.setState({ open: false, selected: null });
  };
  displayRecords = () => {
    const { classes, componentTitle } = this.props;
    const { open, selected } = this.state;

    if (this.props.getRecordsQuery.loading) {
      return (
        <div className={classes.loader}>
          <CircularProgress></CircularProgress>
        </div>
      );
    } else {
      return (
        <div>
          <div
            className={classNames(classes.titleContainer, classes.superCenter)}
          >
            {componentTitle}
          </div>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell align="center">Tipo de usuario</TableCell>
                <TableCell align="center">Acción</TableCell>
                <TableCell align="center">Fecha</TableCell>
                <TableCell align="center">Hora</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.getRecordsQuery.records.map(record => (
                <TableRow key={record.id}>
                  <TableCell component="th" scope="row">
                    {record.user.firstName} {record.user.lastName}
                  </TableCell>
                  <TableCell align="center">
                    {record.user.userType === "Coordinator"
                      ? "Coordinador"
                      : "Representante"}
                  </TableCell>
                  <TableCell align="center">{record.action}</TableCell>
                  <TableCell align="center">{record.date}</TableCell>
                  <TableCell align="center">{record.time}</TableCell>
                  <TableCell className={classes.superCenter}>
                    <div className={classes.flex}>
                      <Button
                        variant="contained"
                        onClick={e => {
                          this.setState({
                            open: true,
                            selected: record
                          });
                        }}
                        className={classes.buttonEdit}
                      >
                        <VisibilityIcon className={classes.icon} />
                      </Button>
                      {selected && (
                        <RecordModal
                          open={open}
                          closeModal={this.closeModal}
                          record={selected}
                        ></RecordModal>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }
  };

  render() {
    return <div>{this.displayRecords()}</div>;
  }
}

Records.propTypes = {
  classes: PropTypes.object.isRequired,
  componentTitle: PropTypes.string.isRequired
};

const ComposedComponent = compose(
  graphql(getRecordsQuery, { name: "getRecordsQuery" })
)(Records);

export default withStyles(styles)(ComposedComponent);

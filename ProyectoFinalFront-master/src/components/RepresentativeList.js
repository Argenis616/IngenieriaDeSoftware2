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
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditRoundedIcon from "@material-ui/icons/EditRounded";

import { connect } from "react-redux";

import styles from "../styles/List";
import { getRepresentativesQuery } from "../queries/queries";
import { deleteUserMutation } from "../queries/mutations";
import RepresentativeModal from "./modal/RepresentativeModal";

class RepresentativeList extends Component {
  state = {
    open: false,
    selected: null
  };
  closeModal = () => {
    this.setState({ open: false, selected: null });
  };
  displayRepresentatives = () => {
    const { classes, componentTitle } = this.props;
    const { open, selected } = this.state;

    if (this.props.getRepresentativesQuery.loading) {
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
                <TableCell>Nombre completo</TableCell>
                <TableCell align="center">Área</TableCell>
                <TableCell align="center">Correo electrónico</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.getRepresentativesQuery.representatives.map(
                representative => (
                  <TableRow key={representative.id}>
                    <TableCell component="th" scope="row">
                      {representative.firstName} {representative.lastName}
                    </TableCell>
                    <TableCell align="center">
                      {representative.area.name}
                    </TableCell>
                    <TableCell align="center">{representative.email}</TableCell>
                    <TableCell className={classes.superCenter}>
                      <div className={classes.flex}>
                        <Button
                          variant="contained"
                          onClick={e => {
                            this.setState({
                              open: true,
                              selected: representative
                            });
                          }}
                          className={classes.buttonEdit}
                        >
                          <EditRoundedIcon className={classes.icon} />
                        </Button>
                        {selected && (
                          <RepresentativeModal
                            open={open}
                            closeModal={this.closeModal}
                            representative={selected}
                          ></RepresentativeModal>
                        )}
                        <Button
                          variant="contained"
                          onClick={e => {
                            this.props.deleteUserMutation({
                              variables: {
                                id: representative.id
                              },
                              refetchQueries: [
                                { query: getRepresentativesQuery }
                              ]
                            });
                            alert(
                              "Se ha eliminado un representante con éxito."
                            );
                          }}
                          className={classes.button}
                        >
                          <DeleteForeverIcon className={classes.icon} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      );
    }
  };

  render() {
    return <div>{this.displayRepresentatives()}</div>;
  }
}

RepresentativeList.propTypes = {
  classes: PropTypes.object.isRequired,
  componentTitle: PropTypes.string.isRequired
};

const ComposedComponent = compose(
  graphql(getRepresentativesQuery, { name: "getRepresentativesQuery" }),
  graphql(deleteUserMutation, {
    name: "deleteUserMutation"
  })
)(RepresentativeList);

export default withStyles(styles)(ComposedComponent);

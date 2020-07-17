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

import styles from "../../styles/List";
import { getAuthorsQuery } from "../../queries/queries";
import { deleteUserMutation } from "../../queries/mutations";
import AuthorModal from "../modal/AuthorModal";

class AuthorList extends Component {
  state = {
    open: false,
    selected: null
  };
  closeModal = () => {
    this.setState({ open: false, selected: null });
  };
  displayAuthors = () => {
    const { classes, componentTitle } = this.props;
    const { open, selected } = this.state;

    if (this.props.getAuthorsQuery.loading) {
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
              {this.props.getAuthorsQuery.authors.map(author => (
                <TableRow key={author.id}>
                  <TableCell component="th" scope="row">
                    {author.firstName} {author.lastName}
                  </TableCell>
                  <TableCell align="center">{author.area.name}</TableCell>
                  <TableCell align="center">{author.email}</TableCell>
                  <TableCell className={classes.superCenter}>
                    <div className={classes.flex}>
                      <Button
                        variant="contained"
                        onClick={e => {
                          this.setState({
                            open: true,
                            selected: author
                          });
                        }}
                        className={classes.buttonEdit}
                      >
                        <EditRoundedIcon className={classes.icon} />
                      </Button>
                      {selected && (
                        <AuthorModal
                          open={open}
                          closeModal={this.closeModal}
                          author={selected}
                          user={this.props.user}
                        ></AuthorModal>
                      )}
                      <Button
                        variant="contained"
                        onClick={e => {
                          this.props.deleteUserMutation({
                            variables: {
                              id: author.id
                            },
                            refetchQueries: [
                              {
                                query: getAuthorsQuery,
                                variables: {
                                  id: this.props.user.id
                                }
                              }
                            ]
                          });
                          alert("Se ha eliminado un autor con éxito.");
                        }}
                        className={classes.button}
                      >
                        <DeleteForeverIcon className={classes.icon} />
                      </Button>
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
    return <div>{this.displayAuthors()}</div>;
  }
}

AuthorList.propTypes = {
  classes: PropTypes.object.isRequired,
  componentTitle: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

const ComposedComponent = compose(
  graphql(getAuthorsQuery, {
    name: "getAuthorsQuery",
    options: props => {
      return {
        variables: {
          id: props.user.id
        }
      };
    }
  }),
  graphql(deleteUserMutation, {
    name: "deleteUserMutation"
  })
)(AuthorList);

export default withStyles(styles)(ComposedComponent);

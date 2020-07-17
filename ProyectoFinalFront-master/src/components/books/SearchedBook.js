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
import Button from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DescriptionIcon from "@material-ui/icons/Description";

import { bindActionCreators } from "redux";
import * as actions from "../../redux/actions";
import { connect } from "react-redux";

import styles from "../../styles/List";
import { getBooksQuery } from "../../queries/queries";
import {
  deleteBookMutation,
  getBooksForSearchMutation
} from "../../queries/mutations";
import SearchedBookModal from "../modal/SearchedBookModal";

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ ...actions }, dispatch);
};

class SearchedBook extends Component {
  state = {
    open: false,
    representativeStates: [
      {
        key: "Solicitado",
        value: "Solicitado",
        futureStates: [
          { key: "Solicitado", value: "Solicitado" },
          { key: "En revisión", value: "En revisión" }
        ]
      },
      {
        key: "En revisión",
        value: "En revisión",
        futureStates: [
          { key: "En revisión", value: "En revisión" },
          { key: "Revisado", value: "Revisado" }
        ]
      },
      {
        key: "Revisado",
        value: "Revisado",
        futureStates: [
          { key: "Revisado", value: "Revisado" },
          { key: "En corrección", value: "En corrección" },
          { key: "Autorizado", value: "Autorizado" },
          { key: "Rechazado", value: "Rechazado" }
        ]
      },
      {
        key: "En corrección",
        value: "En corrección",
        futureStates: [
          { key: "En corrección", value: "En corrección" },
          { key: "Corregido", value: "Corregido" }
        ]
      },
      {
        key: "Corregido",
        value: "Corregido",
        futureStates: [
          { key: "Corregido", value: "Corregido" },
          { key: "Autorizado", value: "Autorizado" }
        ]
      },
      {
        key: "Autorizado",
        value: "Autorizado",
        futureStates: [{ key: "Autorizado", value: "Autorizado" }]
      },
      {
        key: "Rechazado",
        value: "Rechazado",
        futureStates: [{ key: "Rechazado", value: "Rechazado" }]
      }
    ],
    futureRepresentativeStates: null,
    coordinatorStates: [
      {
        key: "Sin ISBN",
        value: "Sin ISBN",
        futureStates: [
          { key: "Sin ISBN", value: "Sin ISBN" },
          { key: "Con ISBN", value: "Con ISBN" }
        ]
      },
      {
        key: "Con ISBN",
        value: "Con ISBN",
        futureStates: [
          { key: "Con ISBN", value: "Con ISBN" },
          { key: "En diseño editorial", value: "En diseño editorial" }
        ]
      },
      {
        key: "En diseño editorial",
        value: "En diseño editorial",
        futureStates: [
          { key: "En diseño editorial", value: "En diseño editorial" },
          { key: "En imprenta", value: "En imprenta" }
        ]
      },
      {
        key: "En imprenta",
        value: "En imprenta",
        futureStates: [
          { key: "En imprenta", value: "En imprenta" },
          { key: "A la venta", value: "A la venta" }
        ]
      },
      {
        key: "A la venta",
        value: "A la venta",
        futureStates: [{ key: "A la venta", value: "A la venta" }]
      }
    ],
    futureCordinatorStates: null
  };

  closeModal = () => {
    this.setState({ open: false, selected: null });
  };

  displayCoordinatorStates = () => {
    const { coordinatorStates } = this.state;
    return coordinatorStates.map(state => {
      return (
        <option key={state.key} value={state.key}>
          {state.value}
        </option>
      );
    });
  };

  displayRepresentativeStates = () => {
    const { representativeStates } = this.state;
    return representativeStates.map(state => {
      return (
        <option key={state.key} value={state.key}>
          {state.value}
        </option>
      );
    });
  };

  displayBook = () => {
    const { classes, searchedBook, user } = this.props;
    const {
      open,
      selected,
      representativeStates,
      coordinatorStates,
      option,
      search
    } = this.state;
    return (
      <div>
        <div
          className={classNames(classes.titleContainer, classes.superCenter)}
        >
          {this.props.searchedBook.name}
        </div>
        <Table className={(classes.table, classes.marginTop)}>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell align="center">Área</TableCell>
              <TableCell align="center">Autor</TableCell>
              <TableCell align="center">Estado Actual</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={this.props.searchedBook.id}>
              <TableCell component="th" scope="row">
                {this.props.searchedBook.name}
              </TableCell>
              <TableCell align="center">
                {this.props.searchedBook.area.name}
              </TableCell>
              <TableCell align="center">
                {this.props.searchedBook.author.firstName}{" "}
                {this.props.searchedBook.author.lastName}
              </TableCell>
              {user.userType === "Representative" ? (
                <TableCell align="center">
                  {this.props.searchedBook.stateRepresentative}
                </TableCell>
              ) : (
                <TableCell align="center">
                  {this.props.searchedBook.stateCoordinator}
                </TableCell>
              )}

              <TableCell className={classes.superCenter}>
                <div className={classes.flex}>
                  <Button
                    variant="contained"
                    onClick={e => {
                      for (let i = 0; i < representativeStates.length; i++) {
                        if (
                          this.props.searchedBook.stateRepresentative ===
                          representativeStates[i].key
                        ) {
                          this.setState({
                            futureRepresentativeStates:
                              representativeStates[i].futureStates
                          });
                        }
                      }
                      for (let i = 0; i < coordinatorStates.length; i++) {
                        if (
                          this.props.searchedBook.stateCoordinator ===
                          coordinatorStates[i].key
                        ) {
                          this.setState({
                            futureCordinatorStates:
                              coordinatorStates[i].futureStates
                          });
                        }
                      }
                      this.setState({
                        open: true,
                        selected: this.props.searchedBook
                      });
                    }}
                    className={classes.buttonEdit}
                  >
                    {user.userType === "Author" ? (
                      <VisibilityIcon className={classes.icon} />
                    ) : (
                      <EditRoundedIcon className={classes.icon} />
                    )}
                  </Button>
                  {selected && (
                    <SearchedBookModal
                      user={user}
                      representativeStates={
                        this.state.futureRepresentativeStates
                      }
                      coordinatorStates={this.state.futureCordinatorStates}
                      open={open}
                      closeModal={this.closeModal}
                      book={selected}
                      showBook={this.props.showBook}
                      setBooksForSearch={this.props.setBooksForSearch}
                    ></SearchedBookModal>
                  )}
                  {user.userType !== "Author" && (
                    <Button
                      variant="contained"
                      onClick={async e => {
                        this.props.showFiles("Files", this.props.searchedBook);
                      }}
                      className={classes.buttonEdit}
                    >
                      <DescriptionIcon className={classes.icon} />
                    </Button>
                  )}
                  {user.userType !== "Author" && (
                    <Button
                      variant="contained"
                      onClick={async e => {
                        await this.props.deleteBookMutation({
                          variables: {
                            id: this.props.searchedBook.id
                          },
                          refetchQueries: [{ query: getBooksQuery }]
                        });
                        const updatedBooks = await this.props.getBooksForSearchMutation(
                          {
                            variables: {
                              userId: this.props.user.id
                            }
                          }
                        );
                        this.props.setBooksForSearch(
                          updatedBooks.data.getBooksForSearch
                        );
                        alert("Se ha eliminado un libro con éxito.");
                        this.props.showBook("Inicio");
                      }}
                      className={classes.button}
                    >
                      <DeleteForeverIcon className={classes.icon} />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  };
  render() {
    const {} = this.props;
    return <div>{this.displayBook()}</div>;
  }
}

SearchedBook.propTypes = {
  classes: PropTypes.object.isRequired,
  searchedBook: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const WrappedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchedBook);

const ComposedComponent = compose(
  graphql(deleteBookMutation, {
    name: "deleteBookMutation"
  }),
  graphql(getBooksForSearchMutation, {
    name: "getBooksForSearchMutation"
  })
)(WrappedComponent);

export default withStyles(styles)(ComposedComponent);

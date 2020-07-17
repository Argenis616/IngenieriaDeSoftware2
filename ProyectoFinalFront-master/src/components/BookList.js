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
import CloseIcon from "@material-ui/icons/Close";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DescriptionIcon from "@material-ui/icons/Description";

import { bindActionCreators } from "redux";
import * as actions from "../redux/actions";
import { connect } from "react-redux";

import styles from "../styles/List";
import {
  getBooksQuery,
  getBooksByAreaIdQuery,
  getAreasQuery
} from "../queries/queries";
import {
  deleteBookMutation,
  getBooksForSearchMutation
} from "../queries/mutations";
import BookModal from "./modal/BookModal";

const mapStateToProps = state => {
  return {
    user: state.user,
    books: state.books,
    booksController: state.booksController
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ ...actions }, dispatch);
};

class BookList extends Component {
  state = {
    open: false,
    selected: null,
    search: "default",
    option: "default",
    searchOptions: [
      { key: "Área", value: "Área" },
      { key: "Estado", value: "Estado" }
    ],
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

  displayAreas = () => {
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
  };

  displaySearchOptions = () => {
    const { searchOptions } = this.state;
    return searchOptions.map(option => {
      return (
        <option key={option.key} value={option.key}>
          {option.value}
        </option>
      );
    });
  };

  displayBooksByArea = () => {
    const {
      classes,
      componentTitle,
      user,
      booksController,
      books
    } = this.props;
    const {
      open,
      selected,
      representativeStates,
      coordinatorStates,
      option
    } = this.state;
    if (this.props.getBooksByAreaIdQuery.loading) {
      return (
        <div className={classes.loader}>
          <CircularProgress></CircularProgress>
        </div>
      );
    } else {
      if (option === "default") {
        const data = this.props.getBooksByAreaIdQuery.booksByAreaId;
        this.props.setBooks(data);
        this.props.setBooksController(data);
      }
      return (
        <div>
          <div
            className={classNames(classes.titleContainer, classes.superCenter)}
          >
            {componentTitle}
          </div>
          {user.userType !== "Author" && (
            <div className={classes.flex}>
              <div className={classes.superCenter}>
                <span className={classes.margin}>Buscar</span>
              </div>
              <select
                className={classNames(
                  classes.input,
                  classes.select,
                  classes.margin
                )}
                value={this.state.option}
                onChange={e => {
                  this.setState({ option: e.target.value });
                  let initialArray = books;
                  let finalArray = [];
                  for (let i = 0; i < initialArray.length; i++) {
                    if (
                      initialArray[i].stateRepresentative === e.target.value
                    ) {
                      finalArray.push(initialArray[i]);
                    }
                  }
                  this.props.setBooksController(finalArray);
                }}
              >
                <option value="default" disabled>
                  Seleccione un estado
                </option>
                {this.displayRepresentativeStates()}
              </select>
              {option !== "default" && (
                <div className={classes.superCenter}>
                  <CloseIcon
                    onClick={() => {
                      this.setState({ option: "default" });
                    }}
                  ></CloseIcon>
                </div>
              )}
            </div>
          )}
          <Table className={classNames(classes.table, classes.marginTop)}>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell align="center">Área</TableCell>
                <TableCell align="center">Autor</TableCell>
                <TableCell align="center">Estado Actual</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            {booksController && (
              <TableBody>
                {booksController.map(book => (
                  <TableRow key={book.id}>
                    <TableCell component="th" scope="row">
                      {book.name}
                    </TableCell>
                    <TableCell align="center">{book.area.name}</TableCell>
                    <TableCell align="center">
                      {book.author.firstName} {book.author.lastName}
                    </TableCell>
                    {user.userType === "Representative" ? (
                      <TableCell align="center">
                        {book.stateRepresentative}
                      </TableCell>
                    ) : (
                      <TableCell align="center">
                        {book.stateCoordinator}
                      </TableCell>
                    )}

                    <TableCell className={classes.superCenter}>
                      <div className={classes.flex}>
                        <Button
                          variant="contained"
                          onClick={e => {
                            for (
                              let i = 0;
                              i < representativeStates.length;
                              i++
                            ) {
                              if (
                                book.stateRepresentative ===
                                representativeStates[i].key
                              ) {
                                this.setState({
                                  futureRepresentativeStates:
                                    representativeStates[i].futureStates
                                });
                              }
                            }
                            this.setState({
                              open: true,
                              selected: book
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
                          <BookModal
                            updateOption={this.updateOption}
                            user={user}
                            representativeStates={
                              this.state.futureRepresentativeStates
                            }
                            coordinatorStates={coordinatorStates}
                            open={open}
                            closeModal={this.closeModal}
                            book={selected}
                          ></BookModal>
                        )}
                        {user.userType !== "Author" && (
                          <Button
                            variant="contained"
                            onClick={async e => {
                              this.props.showFiles("Files", book);
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
                              this.props.deleteBookMutation({
                                variables: {
                                  id: book.id
                                },
                                refetchQueries: [
                                  {
                                    query: getBooksByAreaIdQuery,
                                    variables: {
                                      userId: user.id,
                                      userType: user.userType
                                    }
                                  }
                                ]
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
                              this.setState({ option: "default" });
                              alert("Se ha eliminado un libro con éxito.");
                            }}
                            className={classes.button}
                          >
                            <DeleteForeverIcon className={classes.icon} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      );
    }
  };

  updateOption = async () => {
    await this.setState({ option: "default", search: "default" });
  };

  displayAllBooks = () => {
    const {
      classes,
      componentTitle,
      user,
      booksController,
      books
    } = this.props;
    const {
      open,
      selected,
      representativeStates,
      coordinatorStates,
      option,
      search
    } = this.state;
    if (this.props.getBooksQuery.loading) {
      return (
        <div className={classes.loader}>
          <CircularProgress></CircularProgress>
        </div>
      );
    } else {
      if (option === "default") {
        const data = this.props.getBooksQuery.books;
        this.props.setBooks(data);
        this.props.setBooksController(data);
      }
      return (
        <div>
          <div
            className={classNames(classes.titleContainer, classes.superCenter)}
          >
            {componentTitle}
          </div>
          {user.userType !== "Author" && (
            <div className={classNames(classes.flex)}>
              <div className={classes.superCenter}>
                <span className={classes.margin}>Buscar por</span>
              </div>
              <select
                className={classNames(
                  classes.input,
                  classes.select,
                  classes.margin
                )}
                value={this.state.search}
                onChange={e => {
                  this.setState({ search: e.target.value, option: "default" });
                }}
              >
                <option value="default" disabled>
                  Seleccione una opción
                </option>
                {this.displaySearchOptions()}
              </select>
              {search !== "default" && (
                <select
                  className={classNames(
                    classes.input,
                    classes.select,
                    classes.margin
                  )}
                  value={this.state.option}
                  onChange={e => {
                    if (search === "Estado") {
                      this.setState({ option: e.target.value });
                      let initialArray = books;
                      let finalArray = [];
                      for (let i = 0; i < initialArray.length; i++) {
                        if (
                          initialArray[i].stateCoordinator === e.target.value
                        ) {
                          finalArray.push(initialArray[i]);
                        }
                      }
                      this.props.setBooksController(finalArray);
                    } else {
                      this.setState({ option: e.target.value });
                      let initialArray = books;
                      let finalArray = [];
                      for (let i = 0; i < initialArray.length; i++) {
                        if (initialArray[i].area.id === e.target.value) {
                          finalArray.push(initialArray[i]);
                        }
                      }
                      this.props.setBooksController(finalArray);
                    }
                  }}
                >
                  <option value="default" disabled>
                    {this.state.search === "default"
                      ? ""
                      : this.state.search === "Estado"
                      ? "Seleccione un estado"
                      : "Seleccione un área"}
                  </option>
                  {this.state.search === "default"
                    ? ""
                    : this.state.search === "Estado"
                    ? this.displayCoordinatorStates()
                    : this.displayAreas()}
                </select>
              )}
              {this.state.option !== "default" && (
                <div className={classes.superCenter}>
                  <CloseIcon
                    onClick={() => {
                      this.setState({ option: "default", search: "default" });
                    }}
                  ></CloseIcon>
                </div>
              )}
            </div>
          )}
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
            {booksController && booksController[0] && (
              <TableBody>
                {booksController.map(book => (
                  <TableRow key={book.id}>
                    <TableCell component="th" scope="row">
                      {book.name}
                    </TableCell>
                    <TableCell align="center">{book.area.name}</TableCell>
                    <TableCell align="center">
                      {book.author.firstName} {book.author.lastName}
                    </TableCell>
                    {user.userType === "Representative" ? (
                      <TableCell align="center">
                        {book.stateRepresentative}
                      </TableCell>
                    ) : (
                      <TableCell align="center">
                        {book.stateCoordinator}
                      </TableCell>
                    )}

                    <TableCell className={classes.superCenter}>
                      <div className={classes.flex}>
                        <Button
                          variant="contained"
                          onClick={e => {
                            for (let i = 0; i < coordinatorStates.length; i++) {
                              if (
                                book.stateCoordinator ===
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
                              selected: book
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
                          <BookModal
                            updateOption={this.updateOption}
                            user={user}
                            representativeStates={representativeStates}
                            coordinatorStates={
                              this.state.futureCordinatorStates
                            }
                            open={open}
                            closeModal={this.closeModal}
                            book={selected}
                          ></BookModal>
                        )}
                        {user.userType !== "Author" && (
                          <Button
                            variant="contained"
                            onClick={async e => {
                              this.props.showFiles("Files", book);
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
                              this.props.deleteBookMutation({
                                variables: {
                                  id: book.id
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
                              this.setState({
                                option: "default",
                                search: "default"
                              });
                              alert("Se ha eliminado un libro con éxito.");
                            }}
                            className={classes.button}
                          >
                            <DeleteForeverIcon className={classes.icon} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      );
    }
  };
  render() {
    const { myUser } = this.props;
    return (
      <div>{myUser ? this.displayBooksByArea() : this.displayAllBooks()}</div>
    );
  }
}

BookList.propTypes = {
  classes: PropTypes.object.isRequired,
  componentTitle: PropTypes.string.isRequired,
  myUser: PropTypes.object
};

const WrappedComponent = connect(mapStateToProps, mapDispatchToProps)(BookList);

const ComposedComponent = compose(
  graphql(getBooksQuery, { name: "getBooksQuery" }),
  graphql(getAreasQuery, { name: "getAreasQuery" }),
  graphql(deleteBookMutation, {
    name: "deleteBookMutation"
  }),
  graphql(getBooksForSearchMutation, {
    name: "getBooksForSearchMutation"
  }),
  graphql(getBooksByAreaIdQuery, {
    name: "getBooksByAreaIdQuery",
    options: props => {
      return {
        variables: {
          userId: props.myUser ? props.myUser.id : "",
          userType: props.myUser ? props.myUser.userType : ""
        }
      };
    }
  })
)(WrappedComponent);

export default withStyles(styles)(ComposedComponent);

import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import classNames from "classnames";
import { flowRight as compose } from "lodash";

import { withStyles } from "@material-ui/core/styles";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { connect } from "react-redux";

import styles from "../../styles/BookModal";
import { bindActionCreators } from "redux";
import * as actions from "../../redux/actions";

import {
  updateBookMutation,
  getBooksForSearchMutation,
  addFileMutation
} from "../../queries/mutations";
import { getBooksQuery, getBooksByAreaIdQuery } from "../../queries/queries";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ ...actions }, dispatch);
};
class BookModal extends Component {
  state = {
    stateRepresentative: this.props.book.stateRepresentative,
    stateCoordinator: this.props.book.stateCoordinator,
    file1: {
      name: "",
      base64: ""
    },
    file2: {
      name: "",
      base64: ""
    },
    file3: {
      name: "",
      base64: ""
    },
    file4: {
      name: "",
      base64: ""
    },
    file5: {
      name: "",
      base64: ""
    },
    file6: {
      name: "",
      base64: ""
    },
    typeOfFile1: null,
    typeOfFile2: null,
    typeOfFile3: null,
    typeOfFile4: null,
    typeOfFile5: null,
    typeOfFile6: null,
    sentFile1: false,
    sentFile2: false,
    sentFile3: false,
    sentFile4: false,
    sentFile5: false,
    sentFile6: false,
    ISBN: this.props.book.ISBN
  };

  displayRepresentativeStates() {
    const { representativeStates } = this.props;
    if (representativeStates) {
      return representativeStates.map(state => {
        return (
          <option
            key={state.key}
            value={state.value}
            disabled={this.props.book.stateRepresentative === state.key}
          >
            {state.value}
          </option>
        );
      });
    }
  }

  displayCoordinatorStates() {
    const { coordinatorStates } = this.props;
    if (coordinatorStates) {
      return coordinatorStates.map(state => {
        return (
          <option
            key={state.key}
            value={state.value}
            disabled={this.props.book.stateCoordinator === state.key}
          >
            {state.value}
          </option>
        );
      });
    }
  }

  submitForm = async e => {
    const { book, user } = this.props;
    const { stateRepresentative, stateCoordinator } = this.state;
    e.preventDefault();

    if (user.userType === "Representative") {
      if (book.stateRepresentative === "En revisión") {
        if (book.dictamenOne === "" && this.state.sentFile1 === false) {
          alert("Suba los archivos requeridos para continuar.");
          return;
        }
        if (book.dictamenTwo === "" && this.state.sentFile2 === false) {
          alert("Suba los archivos requeridos para continuar.");
          return;
        }
        if (book.agradecimiento1 === "" && this.state.sentFile4 === false) {
          alert("Suba los archivos requeridos para continuar.");
          return;
        }
        if (book.agradecimiento2 === "" && this.state.sentFile5 === false) {
          alert("Suba los archivos requeridos para continuar.");
          return;
        }
      }
      if (book.stateRepresentative === "Revisado") {
        if (
          book.acceptedBook === "" &&
          this.state.sentFile1 === false &&
          stateRepresentative === "Autorizado"
        ) {
          alert("Suba los archivos requeridos para continuar.");
          return;
        }
      }
      if (book.stateRepresentative === "Corregido") {
        if (book.acceptedBook === "" && this.state.sentFile1 === false) {
          alert("Suba los archivos requeridos para continuar.");
          return;
        }
      }
      if (book.stateRepresentative === "En corrección") {
        if (book.correctedBook === "" && this.state.sentFile1 === false) {
          alert("Suba los archivos requeridos para continuar.");
          return;
        }
      }
    } else if (user.userType === "Coordinator") {
      if (book.stateCoordinator === "Sin ISBN") {
        if (
          (book.fileISBN === "" && this.state.sentFile1 === false) ||
          (book.ISBN === "" && this.state.ISBN === "")
        ) {
          alert(
            "Suba los archivos requeridos y complete los datos para continuar."
          );
          return;
        }
      }
      if (book.stateCoordinator === "En diseño editorial") {
        if (book.armado === "" && this.state.sentFile1 === false) {
          alert("Suba los archivos requeridos para continuar.");
          return;
        }
      }
      if (book.stateCoordinator === "En imprenta") {
        if (book.ready === "" && this.state.sentFile1 === false) {
          alert("Suba los archivos requeridos para continuar.");
          return;
        }
      }
    }

    let result = await this.props.updateBookMutation({
      variables: {
        id: book.id,
        name: book.name,
        areaId: book.area.id,
        authorId: book.author.id,
        stateRepresentative: stateRepresentative,
        stateCoordinator: stateCoordinator
      },
      refetchQueries: [
        user.userType === "Coordinator"
          ? {
              query: getBooksQuery
            }
          : {
              query: getBooksByAreaIdQuery,
              variables: { userId: user.id, userType: user.userType }
            }
      ]
    });
    result = result.data.updateBook;
    const updatedBooks = await this.props.getBooksForSearchMutation({
      variables: {
        userId: this.props.user.id
      }
    });
    this.props.setBooksForSearch(updatedBooks.data.getBooksForSearch);
    alert("Se ha actualizado un libro con éxito.");
    this.props.updateOption();
    this.props.closeModal();
  };

  getBase64 = async file => {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  sendFile1 = async () => {
    if (this.state.file1.name === "" || this.state.file1.base64 === "") {
      return;
    }
    if (
      this.props.user.userType === "Coordinator" &&
      this.props.book.stateCoordinator === "Sin ISBN" &&
      this.state.ISBN === ""
    ) {
      alert("Complete el ISBN para continuar.");
      return;
    }
    const result = await this.props.addFileMutation({
      variables: {
        bookId: this.props.book.id,
        name: this.state.file1.name,
        base64: this.state.file1.base64,
        typeOfFile: this.state.typeOfFile1,
        ISBN: this.state.ISBN
      }
    });
    this.setState({ sentFile1: true });
    return result;
  };

  sendFile2 = async () => {
    if (this.state.file2.name === "" || this.state.file2.base64 === "") {
      return;
    }
    const result = await this.props.addFileMutation({
      variables: {
        bookId: this.props.book.id,
        name: this.state.file2.name,
        base64: this.state.file2.base64,
        typeOfFile: this.state.typeOfFile2,
        ISBN: this.state.ISBN
      }
    });
    this.setState({ sentFile2: true });
    return result;
  };

  sendFile3 = async () => {
    if (this.state.file3.name === "" || this.state.file3.base64 === "") {
      return;
    }
    const result = await this.props.addFileMutation({
      variables: {
        bookId: this.props.book.id,
        name: this.state.file3.name,
        base64: this.state.file3.base64,
        typeOfFile: this.state.typeOfFile3,
        ISBN: this.state.ISBN
      }
    });
    this.setState({ sentFile3: true });
    return result;
  };

  sendFile4 = async () => {
    if (this.state.file4.name === "" || this.state.file4.base64 === "") {
      return;
    }
    const result = await this.props.addFileMutation({
      variables: {
        bookId: this.props.book.id,
        name: this.state.file4.name,
        base64: this.state.file4.base64,
        typeOfFile: this.state.typeOfFile4,
        ISBN: this.state.ISBN
      }
    });
    this.setState({ sentFile4: true });
    return result;
  };

  sendFile5 = async () => {
    if (this.state.file5.name === "" || this.state.file5.base64 === "") {
      return;
    }
    const result = await this.props.addFileMutation({
      variables: {
        bookId: this.props.book.id,
        name: this.state.file5.name,
        base64: this.state.file5.base64,
        typeOfFile: this.state.typeOfFile5,
        ISBN: this.state.ISBN
      }
    });
    this.setState({ sentFile5: true });
    return result;
  };

  sendFile6 = async () => {
    if (this.state.file6.name === "" || this.state.file6.base64 === "") {
      return;
    }
    const result = await this.props.addFileMutation({
      variables: {
        bookId: this.props.book.id,
        name: this.state.file6.name,
        base64: this.state.file6.base64,
        typeOfFile: this.state.typeOfFile6,
        ISBN: this.state.ISBN
      }
    });
    this.setState({ sentFile6: true });
    return result;
  };

  render() {
    const { classes, open, book, user } = this.props;
    return (
      book && (
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
                  <h2 id="transition-modal-title">Modificar Libro</h2>
                </div>
                <div>
                  <form
                    className={classNames(classes.back)}
                    onSubmit={this.submitForm.bind(this)}
                  >
                    <div>
                      <div
                        className={classNames(
                          classes.label,
                          classes.superCenter
                        )}
                      >
                        {book.name}
                      </div>
                    </div>
                    <div>
                      <div
                        className={classNames(
                          classes.label,
                          classes.superCenter
                        )}
                      >
                        {book.area.name}
                      </div>
                    </div>
                    <div>
                      <div
                        className={classNames(
                          classes.label,
                          classes.superCenter
                        )}
                      >
                        {book.author.firstName} {book.author.lastName}
                      </div>
                    </div>
                    {(user.userType === "Representative" ||
                      user.userType === "Author") && (
                      <div>
                        <div
                          className={classNames(
                            classes.label,
                            classes.superCenter
                          )}
                        >
                          {book.stateCoordinator}
                        </div>
                      </div>
                    )}
                    {(user.userType === "Coordinator" ||
                      user.userType === "Author") && (
                      <div>
                        <div
                          className={classNames(
                            classes.label,
                            classes.superCenter
                          )}
                        >
                          {book.stateRepresentative}
                        </div>
                      </div>
                    )}
                    {user.userType !== "Author" && (
                      <div>
                        {user.userType === "Representative" ? (
                          <select
                            className={classNames(
                              classes.input,
                              classes.select
                            )}
                            value={this.state.stateRepresentative}
                            autoFocus
                            disabled={
                              this.state.stateRepresentative === "Autorizado" ||
                              this.state.stateRepresentative === "Rechazado"
                            }
                            onChange={e => {
                              this.setState({
                                stateRepresentative: e.target.value
                              });
                            }}
                          >
                            <option value="default" disabled>
                              Seleccione un estado
                            </option>
                            {this.displayRepresentativeStates()}
                          </select>
                        ) : (
                          <select
                            className={classNames(
                              classes.input,
                              classes.select
                            )}
                            value={this.state.stateCoordinator}
                            autoFocus
                            disabled={
                              this.state.stateRepresentative !== "Autorizado"
                            }
                            onChange={e => {
                              this.setState({
                                stateCoordinator: e.target.value
                              });
                            }}
                          >
                            <option value="default" disabled>
                              Seleccione un estado
                            </option>
                            {this.displayCoordinatorStates()}
                          </select>
                        )}
                      </div>
                    )}
                    {user.userType === "Representative" &&
                      book.stateRepresentative === "En revisión" &&
                      book.dictamenOne === "" &&
                      !this.state.sentFile1 && (
                        <div style={{ marginBottom: "20px" }}>
                          <input
                            type="file"
                            onChange={async e => {
                              if (e.target.files[0]) {
                                const myFile = {
                                  name: book.name + " - Primer arbitro",
                                  base64: await this.getBase64(
                                    e.target.files[0]
                                  )
                                };
                                this.setState({
                                  file1: myFile,
                                  typeOfFile1: "Dictamen 1"
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "5px",
                              color: "blue"
                            }}
                            onClick={this.sendFile1}
                          >
                            Subir dictamen del primer arbitro *
                          </div>
                        </div>
                      )}
                    {user.userType === "Representative" &&
                      book.stateRepresentative === "En revisión" &&
                      book.agradecimiento1 === "" &&
                      !this.state.sentFile4 &&
                      (book.dictamenOne !== "" || this.state.sentFile1) && (
                        <div style={{ marginBottom: "20px" }}>
                          <input
                            type="file"
                            onChange={async e => {
                              if (e.target.files[0]) {
                                const myFile = {
                                  name:
                                    book.name +
                                    " - Agradecimiento primer arbitro",
                                  base64: await this.getBase64(
                                    e.target.files[0]
                                  )
                                };
                                this.setState({
                                  file4: myFile,
                                  typeOfFile4: "Agradecimiento 1"
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "5px",
                              color: "blue"
                            }}
                            onClick={this.sendFile4}
                          >
                            Subir agradecimiento al primer arbitro *
                          </div>
                        </div>
                      )}
                    {user.userType === "Representative" &&
                      book.stateRepresentative === "En revisión" &&
                      book.dictamenTwo === "" &&
                      !this.state.sentFile2 && (
                        <div style={{ marginBottom: "20px" }}>
                          <input
                            type="file"
                            onChange={async e => {
                              if (e.target.files[0]) {
                                const myFile = {
                                  name: book.name + " - Segundo arbitro",
                                  base64: await this.getBase64(
                                    e.target.files[0]
                                  )
                                };
                                this.setState({
                                  file2: myFile,
                                  typeOfFile2: "Dictamen 2"
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "5px",
                              color: "blue"
                            }}
                            onClick={this.sendFile2}
                          >
                            Subir dictamen del segundo arbitro *
                          </div>
                        </div>
                      )}
                    {user.userType === "Representative" &&
                      book.stateRepresentative === "En revisión" &&
                      book.agradecimiento2 === "" &&
                      !this.state.sentFile5 &&
                      (book.dictamenTwo !== "" || this.state.sentFile2) && (
                        <div style={{ marginBottom: "20px" }}>
                          <input
                            type="file"
                            onChange={async e => {
                              if (e.target.files[0]) {
                                const myFile = {
                                  name:
                                    book.name +
                                    " - Agradecimiento segundo arbitro",
                                  base64: await this.getBase64(
                                    e.target.files[0]
                                  )
                                };
                                this.setState({
                                  file5: myFile,
                                  typeOfFile5: "Agradecimiento 2"
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "5px",
                              color: "blue"
                            }}
                            onClick={this.sendFile5}
                          >
                            Subir agradecimiento al segundo arbitro *
                          </div>
                        </div>
                      )}
                    {user.userType === "Representative" &&
                      book.stateRepresentative === "En revisión" &&
                      book.dictamenThree === "" &&
                      !this.state.sentFile3 && (
                        <div style={{ marginBottom: "20px" }}>
                          <input
                            type="file"
                            onChange={async e => {
                              if (e.target.files[0]) {
                                const myFile = {
                                  name: book.name + " - Tercer arbitro",
                                  base64: await this.getBase64(
                                    e.target.files[0]
                                  )
                                };
                                this.setState({
                                  file3: myFile,
                                  typeOfFile3: "Dictamen 3"
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "5px",
                              color: "blue"
                            }}
                            onClick={this.sendFile3}
                          >
                            Subir dictamen del tecer arbitro
                          </div>
                        </div>
                      )}
                    {user.userType === "Representative" &&
                      book.stateRepresentative === "En revisión" &&
                      book.agradecimiento3 === "" &&
                      !this.state.sentFile6 &&
                      (book.dictamenThree !== "" || this.state.sentFile3) && (
                        <div style={{ marginBottom: "20px" }}>
                          <input
                            type="file"
                            onChange={async e => {
                              if (e.target.files[0]) {
                                const myFile = {
                                  name:
                                    book.name +
                                    " - Agradecimiento tercer arbitro",
                                  base64: await this.getBase64(
                                    e.target.files[0]
                                  )
                                };
                                this.setState({
                                  file6: myFile,
                                  typeOfFile6: "Agradecimiento 3"
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "5px",
                              color: "blue"
                            }}
                            onClick={this.sendFile6}
                          >
                            Subir agradecimiento al tercer arbitro
                          </div>
                        </div>
                      )}
                    {user.userType === "Representative" &&
                      book.stateRepresentative === "En corrección" &&
                      book.correctedBook === "" &&
                      !this.state.sentFile1 && (
                        <div style={{ marginBottom: "20px" }}>
                          <input
                            type="file"
                            onChange={async e => {
                              if (e.target.files[0]) {
                                const myFile = {
                                  name: book.name + " - Corregido",
                                  base64: await this.getBase64(
                                    e.target.files[0]
                                  )
                                };
                                this.setState({
                                  file1: myFile,
                                  typeOfFile1: "Libro corregido"
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "5px",
                              color: "blue"
                            }}
                            onClick={this.sendFile1}
                          >
                            Subir libro corregido
                          </div>
                        </div>
                      )}
                    {user.userType === "Representative" &&
                      book.stateRepresentative === "Revisado" &&
                      book.acceptedBook === "" &&
                      this.state.stateRepresentative === "Autorizado" &&
                      !this.state.sentFile1 && (
                        <div style={{ marginBottom: "20px" }}>
                          <input
                            type="file"
                            onChange={async e => {
                              if (e.target.files[0]) {
                                const myFile = {
                                  name: book.name + " - Carta de obra aceptada",
                                  base64: await this.getBase64(
                                    e.target.files[0]
                                  )
                                };
                                this.setState({
                                  file1: myFile,
                                  typeOfFile1: "Libro aceptado"
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "5px",
                              color: "blue"
                            }}
                            onClick={this.sendFile1}
                          >
                            Subir carta de obra aceptada *
                          </div>
                        </div>
                      )}
                    {user.userType === "Representative" &&
                      book.stateRepresentative === "Corregido" &&
                      book.acceptedBook === "" &&
                      !this.state.sentFile1 && (
                        <div style={{ marginBottom: "20px" }}>
                          <input
                            type="file"
                            onChange={async e => {
                              if (e.target.files[0]) {
                                const myFile = {
                                  name: book.name + " - Carta de obra aceptada",
                                  base64: await this.getBase64(
                                    e.target.files[0]
                                  )
                                };
                                this.setState({
                                  file1: myFile,
                                  typeOfFile1: "Libro aceptado"
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "5px",
                              color: "blue"
                            }}
                            onClick={this.sendFile1}
                          >
                            Subir carta de obra aceptada *
                          </div>
                        </div>
                      )}
                    {user.userType === "Coordinator" &&
                      book.stateCoordinator === "Sin ISBN" &&
                      book.stateRepresentative === "Autorizado" &&
                      book.fileISBN === "" &&
                      book.ISBN === "" &&
                      !this.state.sentFile1 && (
                        <div style={{ marginBottom: "20px" }}>
                          <div>
                            <input
                              placeholder="ISBN"
                              value={this.state.ISBN}
                              className={classes.input}
                              type="text"
                              onChange={e => {
                                this.setState({ ISBN: e.target.value });
                              }}
                            ></input>
                          </div>
                          <input
                            type="file"
                            onChange={async e => {
                              if (e.target.files[0]) {
                                const myFile = {
                                  name: book.name + " - Con ISBN",
                                  base64: await this.getBase64(
                                    e.target.files[0]
                                  )
                                };
                                this.setState({
                                  file1: myFile,
                                  typeOfFile1: "Libro con ISBN"
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "5px",
                              color: "blue"
                            }}
                            onClick={this.sendFile1}
                          >
                            Subir libro con ISBN *
                          </div>
                        </div>
                      )}
                    {user.userType === "Coordinator" &&
                      book.stateCoordinator === "En diseño editorial" &&
                      book.armado === "" &&
                      !this.state.sentFile1 && (
                        <div style={{ marginBottom: "20px" }}>
                          <input
                            type="file"
                            onChange={async e => {
                              if (e.target.files[0]) {
                                const myFile = {
                                  name: book.name + " - Libro armado",
                                  base64: await this.getBase64(
                                    e.target.files[0]
                                  )
                                };
                                this.setState({
                                  file1: myFile,
                                  typeOfFile1: "Libro armado"
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "5px",
                              color: "blue"
                            }}
                            onClick={this.sendFile1}
                          >
                            Subir libro armado *
                          </div>
                        </div>
                      )}
                    {user.userType === "Coordinator" &&
                      book.stateCoordinator === "En imprenta" &&
                      book.ready === "" &&
                      !this.state.sentFile1 && (
                        <div style={{ marginBottom: "20px" }}>
                          <input
                            type="file"
                            onChange={async e => {
                              if (e.target.files[0]) {
                                const myFile = {
                                  name:
                                    book.name + " - Libro listo para vender",
                                  base64: await this.getBase64(
                                    e.target.files[0]
                                  )
                                };
                                this.setState({
                                  file1: myFile,
                                  typeOfFile1: "Libro listo"
                                });
                              }
                            }}
                          />
                          <div
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "5px",
                              color: "blue"
                            }}
                            onClick={this.sendFile1}
                          >
                            Subir libro listo para vender *
                          </div>
                        </div>
                      )}
                    {user.userType !== "Author" && (
                      <div className={classes.superCenter}>
                        <button className={classes.button}>
                          Realizar cambios
                        </button>
                      </div>
                    )}
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

BookModal.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  book: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  representativeStates: PropTypes.array.isRequired,
  coordinatorStates: PropTypes.array.isRequired
};

const WrappedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(BookModal);

const ComposedComponent = compose(
  graphql(updateBookMutation, {
    name: "updateBookMutation"
  }),
  graphql(getBooksForSearchMutation, {
    name: "getBooksForSearchMutation"
  }),
  graphql(addFileMutation, {
    name: "addFileMutation"
  })
)(WrappedComponent);

export default withStyles(styles, { withTheme: true })(ComposedComponent);

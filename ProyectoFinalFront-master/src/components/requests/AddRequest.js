import React, { Component } from "react";
import { graphql } from "react-apollo";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Checkbox from "@material-ui/core/Checkbox";
import { connect } from "react-redux";
import { flowRight as compose } from "lodash";

import {
  getRepresentativesQuery,
  getAreaByRepresentativeId,
  getUserQuery
} from "../../queries/queries";
import {
  addFirstFilesMutation,
  addRequestMutation
} from "../../queries/mutations";
import styles from "../../styles/request/AddRequest";

const mapStateToProps = state => {
  return {};
};

class AddRequest extends Component {
  state = {
    bookName: "",
    justification: "",
    docencia: {
      active: false,
      priority: "",
      justification: "",
      kindOfText: ""
    },
    research: {
      active: false,
      priority: ""
    },
    difusion: {
      active: false,
      priority: ""
    },
    myPublic: "default",
    market: "",
    numberOfBooks: "",
    financing: "",
    autorization: false,
    sentData: false,
    file1: {
      name: "",
      base64: ""
    },
    file2: {
      name: "",
      base64: ""
    },
    typeOfFile1: null,
    typeOfFile2: null,
    sentFile1: false,
    sentFile2: false
  };

  sendFile1 = async () => {
    if (this.state.file1.name === "" || this.state.file1.base64 === "") {
      alert("Suba un archivo.");
      return;
    }
    const result = await this.props.addFirstFilesMutation({
      variables: {
        bookName: this.state.file1.name,
        base64: this.state.file1.base64,
        typeOfFile: this.state.typeOfFile1
      }
    });
    this.setState({ sentFile1: true });
    return result;
  };

  sendFile2 = async () => {
    if (this.state.file2.name === "" || this.state.file2.base64 === "") {
      alert("Suba un archivo.");
      return;
    }
    const result = await this.props.addFirstFilesMutation({
      variables: {
        bookName: this.state.file2.name,
        base64: this.state.file2.base64,
        typeOfFile: this.state.typeOfFile2
      }
    });
    this.setState({ sentFile2: true });
    return result;
  };

  getBase64 = async file => {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  displayArea() {
    const data = this.props.getAreaByRepresentativeId;
    if (!data.loading) {
      return data.areaByRepresentativeId.name;
    }
  }

  displayAuthor() {
    const data = this.props.getUserQuery;
    if (!data.loading) {
      return (
        <div>
          {data.user.firstName} {data.user.lastName}
        </div>
      );
    }
  }

  validateForm = () => {
    const {
      bookName,
      justification,
      docencia,
      research,
      difusion,
      myPublic,
      market,
      numberOfBooks,
      financing,
      autorization
    } = this.state;
    const onlyNumbersPattern = /^[0-9]+( [0-9]+)*$/;
    let errors = [];
    if (
      bookName.trim() === "" ||
      justification.trim() === "" ||
      myPublic.trim() === "default" ||
      market.trim() === "" ||
      numberOfBooks === "" ||
      financing === "" ||
      (docencia.active === false &&
        research.active === false &&
        difusion.active === false)
    ) {
      errors.push("Complete todos los campos");
    } else {
      !onlyNumbersPattern.test(numberOfBooks.trim()) &&
        errors.push("Escriba una cantidad de libros válida");
    }
    if (autorization === false) {
      errors.push(
        "Debe dar la autorización para que sus datos puedan ser usados."
      );
    }
    if (docencia.active === true) {
      if (
        docencia.justification.trim() === "" ||
        docencia.kindOfText.trim() === ""
      ) {
        errors.push("Complete todos los campos de docencia");
      }
    }
    if (
      docencia.active === true &&
      research.active === true &&
      difusion.active === false
    ) {
      if (docencia.priority.trim() === "" || research.priority.trim() === "") {
        errors.push("Complete el orden de prioridad");
      } else {
        !onlyNumbersPattern.test(docencia.priority.trim()) &&
          errors.push("Escriba un orden de prioridad para docencia válido");
        !onlyNumbersPattern.test(research.priority.trim()) &&
          errors.push(
            "Escriba un orden de prioridad para investigación válido"
          );
      }
    }
    if (
      docencia.active === true &&
      difusion.active === true &&
      research.active === false
    ) {
      if (docencia.priority.trim() === "" || difusion.priority.trim() === "") {
        errors.push("Complete el orden de prioridad");
      } else {
        !onlyNumbersPattern.test(docencia.priority.trim()) &&
          errors.push("Escriba un orden de prioridad para docencia válido");
        !onlyNumbersPattern.test(difusion.priority.trim()) &&
          errors.push("Escriba un orden de prioridad para difusión válido");
      }
    }
    if (
      research.active === true &&
      difusion.active === true &&
      docencia.active === false
    ) {
      if (research.priority.trim() === "" || difusion.priority.trim() === "") {
        errors.push("Complete el orden de prioridad");
      } else {
        !onlyNumbersPattern.test(research.priority.trim()) &&
          errors.push(
            "Escriba un orden de prioridad para investigación válido"
          );
        !onlyNumbersPattern.test(difusion.priority.trim()) &&
          errors.push("Escriba un orden de prioridad para difusión válido");
      }
    }
    if (
      docencia.active === true &&
      research.active === true &&
      difusion.active === true
    ) {
      if (
        docencia.priority.trim() === "" ||
        research.priority.trim() === "" ||
        difusion.priority.trim() === ""
      ) {
        errors.push("Complete el orden de prioridad");
      } else {
        !onlyNumbersPattern.test(docencia.priority.trim()) &&
          errors.push("Escriba un orden de prioridad para docencia válido");
        !onlyNumbersPattern.test(research.priority.trim()) &&
          errors.push(
            "Escriba un orden de prioridad para investigación válido"
          );
        !onlyNumbersPattern.test(difusion.priority.trim()) &&
          errors.push("Escriba un orden de prioridad para difusión válido");
      }
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
    let result = await this.props.addRequestMutation({
      variables: {
        areaId: this.props.getUserQuery.user.area.id,
        authorId: this.props.user.id,
        bookName: this.state.bookName.trim(),
        justification: this.state.justification,
        docenciaActive: this.state.docencia.active,
        docenciaPriority: this.state.docencia.priority,
        docenciaJustification: this.state.docencia.justification,
        docenciaKindOfText: this.state.docencia.kindOfText,
        researchActive: this.state.research.active,
        researchPriority: this.state.research.priority,
        difusionActive: this.state.difusion.active,
        difusionPriority: this.state.difusion.priority,
        myPublic: this.state.myPublic,
        market: this.state.market,
        numberOfBooks: this.state.numberOfBooks,
        financing: this.state.financing,
        autorization: this.state.autorization
      },
      refetchQueries: [{ query: getRepresentativesQuery }]
    });
    result = result.data.addRequest;
    if (result) {
      this.setState({
        sentData: true
      });
      alert("Se ha generado la solicitud con éxito.");
    } else {
      alert("No se ha podido generar la solicitud.");
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div>
          <div
            className={classNames(classes.titleContainer, classes.superCenter)}
            style={{}}
          >
            NUEVA SOLICITUD DE PUBLICACIÓN
          </div>
          <form
            className={classNames(classes.back)}
            onSubmit={this.submitForm.bind(this)}
          >
            <div
              style={{
                display: "flex",
                marginBottom: "20px"
              }}
            >
              <div style={{ width: "50%" }} className={classes.superCenter}>
                <input
                  placeholder="Escriba el título de la obra"
                  type="text"
                  className={classes.inputTitulo}
                  required
                  autoFocus
                  disabled={this.state.sentData}
                  value={this.state.bookName}
                  onChange={e => this.setState({ bookName: e.target.value })}
                />
              </div>
              <div style={{ width: "50%" }} className={classes.superCenter}>
                Area:&nbsp;{this.displayArea()}
              </div>
            </div>
            <div
              className={classes.superCenter}
              style={{
                width: "100%",
                marginBottom: "20px"
              }}
            >
              <TextareaAutosize
                value={this.state.justification}
                onChange={e => this.setState({ justification: e.target.value })}
                style={{
                  resize: "none",
                  width: "100%",
                  borderRadius: "5px",
                  overflow: "hidden",
                  border: "1px solid #3f51b5"
                }}
                rows={3}
                placeholder="Justificación y argumentación para la publicación de la obra"
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ marginBottom: "10px" }}>
                <span>
                  La finalidad de la publicación es (en caso de ser más de una,
                  enumerarlas por orden de prioridad):
                </span>
              </div>
              <div>
                <div>
                  <span>a) La docencia</span>
                  <Checkbox
                    onChange={e => {
                      const myDocencia = {
                        active: !this.state.docencia.active,
                        priority: this.state.docencia.priority,
                        justification: this.state.docencia.justification,
                        kindOfText: this.state.docencia.kindOfText
                      };
                      this.setState({ docencia: myDocencia });
                    }}
                  />
                  {this.state.docencia.active && (
                    <input
                      placeholder=""
                      type="text"
                      className={classes.inputBox}
                      value={this.state.docencia.priority}
                      style={{ marginBottom: "0px" }}
                      onChange={e => {
                        const myDocencia = {
                          active: this.state.docencia.active,
                          priority: e.target.value,
                          justification: this.state.docencia.justification,
                          kindOfText: this.state.docencia.kindOfText
                        };
                        this.setState({ docencia: myDocencia });
                      }}
                    />
                  )}
                </div>
                {this.state.docencia.active && (
                  <div>
                    <RadioGroup
                      style={{ display: "flex", flexDirection: "row" }}
                      onChange={e => {
                        const myDocencia = {
                          active: this.state.docencia.active,
                          priority: this.state.docencia.priority,
                          justification: this.state.docencia.justification,
                          kindOfText: e.target.value
                        };
                        this.setState({ docencia: myDocencia });
                      }}
                    >
                      <FormControlLabel
                        value="Texto"
                        style={{}}
                        control={<Radio color="primary" />}
                        label="Texto"
                      />
                      <FormControlLabel
                        value="Manual"
                        control={<Radio color="primary" />}
                        label="Manual"
                      />
                      <FormControlLabel
                        value="Antología"
                        control={<Radio color="primary" />}
                        label="Antología"
                      />
                      <FormControlLabel
                        value="Consulta"
                        control={<Radio color="primary" />}
                        label="Consulta"
                      />
                      <FormControlLabel
                        value="Otro"
                        control={<Radio color="primary" />}
                        label="Otro"
                      />
                    </RadioGroup>
                    <TextareaAutosize
                      value={this.state.docencia.justification}
                      onChange={e => {
                        const myDocencia = {
                          active: this.state.docencia.active,
                          priority: this.state.docencia.priority,
                          justification: e.target.value,
                          kindOfText: this.state.docencia.kindOfText
                        };
                        this.setState({ docencia: myDocencia });
                      }}
                      rows={2}
                      style={{
                        resize: "none",
                        borderRadius: "5px",
                        width: "500px"
                      }}
                      placeholder="Justifique a qué programa (s) y asignatura (s) apoyará la propuesta"
                    />
                  </div>
                )}
              </div>
              <div>
                <span>b) La investigación</span>
                <Checkbox
                  onChange={e => {
                    const myResearch = {
                      active: !this.state.research.active,
                      priority: this.state.research.priority
                    };
                    this.setState({ research: myResearch });
                  }}
                />
                {this.state.research.active && (
                  <input
                    placeholder=""
                    className={classes.inputBox}
                    type="text"
                    style={{ marginBottom: "0px" }}
                    value={this.state.research.priority}
                    onChange={e => {
                      const myResearch = {
                        active: this.state.research.active,
                        priority: e.target.value
                      };
                      this.setState({ research: myResearch });
                    }}
                  />
                )}
              </div>
              <div>
                <span>c) La difusión</span>
                <Checkbox
                  onChange={e => {
                    const myDifusion = {
                      active: !this.state.difusion.active,
                      priority: this.state.difusion.priority
                    };
                    this.setState({ difusion: myDifusion });
                  }}
                />
                {this.state.difusion.active && (
                  <input
                    placeholder=""
                    className={classes.inputBox}
                    type="text"
                    style={{ marginBottom: "0px" }}
                    value={this.state.difusion.priority}
                    onChange={e => {
                      const myDifusion = {
                        active: this.state.difusion.active,
                        priority: e.target.value
                      };
                      this.setState({ difusion: myDifusion });
                    }}
                  />
                )}
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <span>El público al que va dirigido es</span>
              <select
                className={classNames(classes.input, classes.select)}
                value={this.state.myPublic}
                onChange={e => {
                  this.setState({ myPublic: e.target.value });
                }}
                style={{ marginLeft: "10px", marginBottom: "0px" }}
              >
                <option value="default" disabled>
                  Seleccione un publico
                </option>
                <option value="Bachillerato">Bachillerato</option>
                <option value="Licenciatura">Licenciatura</option>
                <option value="Posgrado">Posgrado</option>
                <option value="Publico general">Público general</option>
              </select>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <span>
                El mercado potencial es de (cuántos grupos, alumnos y/o
                instituciones)
              </span>
              <input
                placeholder="Ejm: 5 grupos"
                required
                style={{ marginLeft: "10px", marginBottom: "0px" }}
                value={this.state.market}
                onChange={e => this.setState({ market: e.target.value })}
                className={classes.input}
                type="text"
              />
              , por lo que se propone un tiraje de
              <input
                placeholder="0"
                required
                style={{ marginLeft: "10px", marginBottom: "0px" }}
                value={this.state.numberOfBooks}
                onChange={e => this.setState({ numberOfBooks: e.target.value })}
                className={classes.inputNumber}
                type="text"
              />{" "}
              ejemplares.
            </div>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ marginBottom: "10px" }}>Financiamiento:</span>
              <RadioGroup
                style={{ display: "flex", flexDirection: "row" }}
                onChange={e => {
                  this.setState({ financing: e.target.value });
                }}
              >
                <FormControlLabel
                  value="Recursos externos"
                  control={<Radio color="primary" />}
                  label="Recursos externos"
                />
                <FormControlLabel
                  value="Sin recursos"
                  control={<Radio color="primary" />}
                  label="Sin recursos"
                />
              </RadioGroup>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <Checkbox
                onChange={e => {
                  this.setState({ autorization: !this.state.autorization });
                }}
              />
              <span>
                Al completar este formulario, doy el permiso de utilizar mis
                datos.
              </span>
            </div>
            <div style={{ display: "flex", marginBottom: "20px" }}>
              Autor:&nbsp;{this.displayAuthor()}
            </div>
            {!this.state.sentData && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <button className={classes.button}>Generar Solicitud</button>
              </div>
            )}
          </form>
          {this.state.sentData && !this.state.sentFile1 && (
            <div style={{ marginBottom: "20px" }}>
              <input
                type="file"
                onChange={async e => {
                  if (e.target.files[0]) {
                    const myFile = {
                      name: this.state.bookName,
                      base64: await this.getBase64(e.target.files[0])
                    };
                    this.setState({
                      file1: myFile,
                      typeOfFile1: "Libro con nombres"
                    });
                  }
                }}
              />
              <div
                style={{
                  cursor: "pointer",
                  marginTop: "5px",
                  color: "blue"
                }}
                onClick={this.sendFile1}
              >
                Subir el libro con nombres *
              </div>
            </div>
          )}
          {this.state.sentData && !this.state.sentFile2 && (
            <div style={{ marginBottom: "20px" }}>
              <input
                type="file"
                onChange={async e => {
                  if (e.target.files[0]) {
                    const myFile = {
                      name: this.state.bookName,
                      base64: await this.getBase64(e.target.files[0])
                    };
                    this.setState({
                      file2: myFile,
                      typeOfFile2: "Libro sin nombres"
                    });
                  }
                }}
              />
              <div
                style={{
                  cursor: "pointer",
                  marginTop: "5px",
                  color: "blue"
                }}
                onClick={this.sendFile2}
              >
                Subir el libro sin nombres *
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

AddRequest.propTypes = {
  classes: PropTypes.object.isRequired,
  componentTitle: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

const WrappedComponent = connect(mapStateToProps, null)(AddRequest);

const ComposedComponent = compose(
  graphql(addRequestMutation, { name: "addRequestMutation" }),
  graphql(addFirstFilesMutation, { name: "addFirstFilesMutation" }),
  graphql(getAreaByRepresentativeId, {
    name: "getAreaByRepresentativeId",
    options: props => {
      return {
        variables: {
          id: props.user.id
        }
      };
    }
  }),
  graphql(getUserQuery, {
    name: "getUserQuery",
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

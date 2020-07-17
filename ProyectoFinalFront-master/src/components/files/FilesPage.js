import React, { Component } from "react";
import { graphql } from "react-apollo";
import PropTypes from "prop-types";
import classNames from "classnames";
import { flowRight as compose } from "lodash";

import { withStyles } from "@material-ui/core/styles";
import DescriptionIcon from "@material-ui/icons/Description";

import { connect } from "react-redux";

import styles from "../../styles/List";
import { addFileMutation } from "../../queries/mutations";
import { getFiles } from "../../queries/queries";

class FilesPage extends Component {
  state = {};

  showFiles = () => {
    const { book } = this.props;
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#3f51b5",
            fontSize: "30px",
            marginBottom: "30px"
          }}
        >
          {book.name}
        </div>
        {book.requestUrl !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>Solicitud de publicacion:</div>
            <a
              href={"http://localhost:4000" + book.requestUrl}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.fileWithNames !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>Libro con nombres:</div>
            <a
              href={"http://localhost:4000" + book.fileWithNames}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.fileWithoutNames !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>Libro sin nombres:</div>
            <a
              href={"http://localhost:4000" + book.fileWithoutNames}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.dictamenOne !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>
              Dictamen del primer árbitro:
            </div>
            <a
              href={"http://localhost:4000" + book.dictamenOne}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.agradecimiento1 !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>
              Agradecimiento al primer árbitro:
            </div>
            <a
              href={"http://localhost:4000" + book.agradecimiento1}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.dictamenTwo !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>
              Dictamen del segundo árbitro:
            </div>
            <a
              href={"http://localhost:4000" + book.dictamenTwo}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.agradecimiento2 !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>
              Agradecimiento al segundo árbitro:
            </div>
            <a
              href={"http://localhost:4000" + book.agradecimiento2}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.dictamenThree !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>
              Dictamen del tercer árbitro:
            </div>
            <a
              href={"http://localhost:4000" + book.dictamenThree}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.agradecimiento3 !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>
              Agradecimiento al tercer árbitro:
            </div>
            <a
              href={"http://localhost:4000" + book.agradecimiento3}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.correctedBook !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>Libro corregido:</div>
            <a
              href={"http://localhost:4000" + book.correctedBook}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.acceptedBook !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>Carta de obra aceptada:</div>
            <a
              href={"http://localhost:4000" + book.acceptedBook}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.ISBN !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>ISBN:</div>
            <div style={{ color: "blue" }}>{book.ISBN}</div>
          </div>
        )}
        {book.fileISBN !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>Libro con ISBN:</div>
            <a
              href={"http://localhost:4000" + book.fileISBN}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.armado !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>Libro armado:</div>
            <a
              href={"http://localhost:4000" + book.armado}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
        {book.ready !== "" && (
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "20px" }}>Libro listo para vender:</div>
            <a
              href={"http://localhost:4000" + book.ready}
              target="_blank"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Ver archivo
            </a>
          </div>
        )}
      </div>
    );
  };

  render() {
    return <div>{this.showFiles()}</div>;
  }
}

FilesPage.propTypes = {
  classes: PropTypes.object.isRequired,
  book: PropTypes.object.isRequired
};

export default withStyles(styles)(FilesPage);

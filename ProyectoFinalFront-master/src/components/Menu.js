import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import { connect } from "react-redux";

import styles from "../styles/Menu";
import { bindActionCreators } from "redux";
import * as actions from "../redux/actions";

import AddRepresentative from "./AddRepresentative";
import AddAuthor from "./authors/AddAuthor";
import AuthorList from "./authors/AuthorList";
import RepresentativeList from "./RepresentativeList";
import BookList from "./BookList";
import Records from "./records/Records";
import AddRequest from "./requests/AddRequest";
import Search from "./search/Search";
import SearchedBook from "./books/SearchedBook";
import FilesPage from "./files/FilesPage";

const mapStateToProps = state => {
  return {
    user: state.user,
    booksForSearch: state.booksForSearch,
    searchedBook: state.searchedBook
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ ...actions }, dispatch);
};

class Menu extends Component {
  async componentDidMount() {
    const myComponents = [
      {
        type: "nested",
        title: "Representantes",
        controller: "openRepresentative",
        subComponents: [
          { title: "Crear Representante", value: "createRepresentative" },
          { title: "Lista de Representantes", value: "representativeList" }
        ],
        users: ["Coordinator"]
      },
      {
        type: "nested",
        title: "Autores",
        controller: "openAuthor",
        subComponents: [
          { title: "Crear Autor", value: "createAuthor" },
          { title: "Lista de Autores", value: "authorList" }
        ],
        users: ["Representative"]
      },
      {
        type: "nested",
        title: "Solicitudes de publicaciones",
        controller: "openRequest",
        subComponents: [{ title: "Crear Solicitud", value: "createRequest" }],
        users: ["Author"]
      },
      {
        type: "nested",
        title: "Libros",
        controller: "openBook",
        subComponents: [{ title: "Lista de Libros", value: "bookList" }],
        users: ["Coordinator", "Representative", "Author"]
      },
      {
        type: "normal",
        title: "Bitácoras",
        value: "records",
        users: ["Coordinator"]
      },
      {
        type: "normal",
        title: "Cerrar Sesión",
        users: ["Coordinator", "Representative", "Author"]
      }
    ];
    await this.setState({
      components: myComponents
    });
    /*this.state.components &&
      this.setState({
        currentComponent:
          this.state.components[0].type === "normal"
            ? this.state.components[0]
            : this.state.components[0].subComponents[0],
        componentTitle: this.state.components[0].title
      });*/
    this.state.components &&
      this.setState({
        currentComponent: { value: "" },
        componentTitle: ""
      });
  }
  state = {
    componentTitle: null,
    components: null,
    currentComponent: null,
    openRepresentative: false,
    openRequest: false,
    openBook: false,
    openAuthor: false,
    bookShowed: null
  };
  showBook = value => {
    const myCurrentComponent = {
      value: value
    };
    this.setState({ currentComponent: myCurrentComponent });
  };
  showFiles = (value, myBook) => {
    const myCurrentComponent = {
      value: value
    };
    this.setState({ currentComponent: myCurrentComponent, bookShowed: myBook });
  };
  handleClick = component => {
    switch (component.title) {
      case "Autores":
        this.setState({ openAuthor: !this.state.openAuthor });
        break;
      case "Representantes":
        this.setState({ openRepresentative: !this.state.openRepresentative });
        break;
      case "Solicitudes de publicaciones":
        this.setState({ openRequest: !this.state.openRequest });
        break;
      case "Libros":
        this.setState({ openBook: !this.state.openBook });
        break;
    }
  };
  render() {
    const { classes, user } = this.props;
    const {
      components,
      currentComponent,
      openRequest,
      openRepresentative,
      openBook,
      openAuthor
    } = this.state;
    return (
      currentComponent && (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar
              className={classNames(
                classes.cienciasContainer,
                classes.superCenter
              )}
            >
              <div className={classNames(classes.root, classes.absoluteRight)}>
                <div
                  className={classNames(
                    classes.superCenter,
                    classes.cienciasTextContainer
                  )}
                >
                  <Typography variant="h6" noWrap>
                    Facultad de Ciencias
                  </Typography>
                </div>
                <div className={classes.superCenter}>
                  <img
                    className={classes.logoCiencias}
                    src="/static/logocienciasblanco.png"
                  ></img>
                </div>
              </div>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper
            }}
            anchor="left"
          >
            <div className={classNames(classes.toolbar, classes.superCenter)}>
              <div className={classes.root}>
                <div className={classNames(classes.superCenter)}>
                  <img
                    className={classes.logoPrensa}
                    src="/static/logoprensa.png"
                  ></img>
                </div>
                <div
                  className={classNames(
                    classes.superCenter,
                    classes.prensaContainer
                  )}
                >
                  <span>Prensas de Ciencias</span>
                </div>
              </div>
            </div>
            <Divider />
            <List>
              {components.map(component =>
                component.type === "normal"
                  ? component.users.includes(user.userType) && (
                      <ListItem
                        button
                        key={component.title}
                        onClick={e => {
                          if (component.title === "Cerrar Sesión") {
                            this.props.setUser(null);
                          } else {
                            this.setState({
                              currentComponent: component,
                              componentTitle: component.title
                            });
                          }
                        }}
                      >
                        <ListItemIcon>
                          <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary={component.title} />
                      </ListItem>
                    )
                  : component.users.includes(user.userType) && (
                      <div key={component.title}>
                        <ListItem
                          button
                          key={component.title}
                          onClick={() => {
                            this.handleClick(component);
                          }}
                        >
                          <ListItemIcon>
                            <InboxIcon />
                          </ListItemIcon>
                          <ListItemText primary={component.title} />
                          <ExpandMore />
                        </ListItem>
                        <Collapse
                          in={
                            component.controller === "openRepresentative"
                              ? openRepresentative
                              : component.controller === "openRequest"
                              ? openRequest
                              : component.controller === "openBook"
                              ? openBook
                              : component.controller === "openAuthor"
                              ? openAuthor
                              : ""
                          }
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding>
                            {component.subComponents.map(subComponent => (
                              <ListItem
                                button
                                key={subComponent.title}
                                className={classes.nested}
                                onClick={e => {
                                  this.setState({
                                    currentComponent: subComponent,
                                    componentTitle: component.title
                                  });
                                }}
                              >
                                <ListItemIcon>
                                  <StarBorder />
                                </ListItemIcon>
                                <div className={classes.nestedSize}>
                                  {subComponent.title}
                                </div>
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      </div>
                    )
              )}
            </List>
            <Divider />
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar}></div>
            <Search
              books={this.props.booksForSearch}
              showBook={this.showBook}
              setSearchedBook={this.props.setSearchedBook}
            ></Search>
            <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />
            {currentComponent.value === "createRequest" && (
              <AddRequest
                user={user}
                componentTitle={this.state.componentTitle}
              ></AddRequest>
            )}
            {currentComponent.value === "createRepresentative" && (
              <AddRepresentative
                componentTitle={this.state.componentTitle}
              ></AddRepresentative>
            )}
            {currentComponent.value === "createAuthor" && user && (
              <AddAuthor
                user={user}
                componentTitle={this.state.componentTitle}
              ></AddAuthor>
            )}
            {currentComponent.value === "authorList" && user && (
              <AuthorList
                user={user}
                componentTitle={this.state.componentTitle}
              ></AuthorList>
            )}
            {currentComponent.value === "representativeList" && (
              <RepresentativeList
                componentTitle={this.state.componentTitle}
              ></RepresentativeList>
            )}
            {currentComponent.value === "bookList" &&
              user &&
              (user.userType === "Representative" ||
              user.userType === "Author" ? (
                <BookList
                  myUser={user}
                  componentTitle={this.state.componentTitle}
                  showFiles={this.showFiles}
                ></BookList>
              ) : (
                <BookList
                  componentTitle={this.state.componentTitle}
                  showFiles={this.showFiles}
                ></BookList>
              ))}
            {currentComponent.value === "records" && (
              <Records componentTitle={this.state.componentTitle}></Records>
            )}
            {currentComponent.value === "Files" && this.state.bookShowed && (
              <FilesPage book={this.state.bookShowed}></FilesPage>
            )}
            {currentComponent.value === "searchedBook" &&
              this.props.searchedBook && (
                <SearchedBook
                  componentTitle={this.state.componentTitle}
                  searchedBook={this.props.searchedBook}
                  showBook={this.showBook}
                  showFiles={this.showFiles}
                ></SearchedBook>
              )}
          </main>
        </div>
      )
    );
  }
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired
};

const WrappedComponent = connect(mapStateToProps, mapDispatchToProps)(Menu);

export default withStyles(styles, { withTheme: true })(WrappedComponent);

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3)
  },
  nested: {
    paddingLeft: "20px"
  },
  nestedSize: {
    fontSize: "12px"
  },
  backgroundBlue: {
    backgroundColor: "#556cd6"
  },
  logoPrensa: {
    height: "55px"
  },
  superCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  prensaContainer: {
    marginLeft: "5px"
  },
  logoCiencias: {
    height: "55px"
  },
  cienciasContainer: {
    position: "relative"
  },
  absoluteRight: {
    position: "absolute",
    right: "1%"
  },
  cienciasTextContainer: {
    marginRight: "5px"
  }
});

export default styles;

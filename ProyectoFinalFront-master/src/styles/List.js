const styles = theme => ({
  table: {
    minWidth: "650px"
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    margin: theme.spacing(1),
    backgroundColor: "#ff1744",
    "&:hover": {
      backgroundColor: "#ff4081"
    }
  },
  buttonEdit: {
    margin: theme.spacing(1),
    backgroundColor: "blue",
    "&:hover": {
      backgroundColor: "#1976d2"
    }
  },
  icon: {
    color: "white"
  },
  titleContainer: {
    fontSize: "30px",
    color: "#3f51b5",
    marginBottom: "30px"
  },
  superCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  flex: {
    display: "flex"
  },
  margin: {
    marginLeft: "10px",
    marginRight: "10px"
  },
  marginTop: {
    marginTop: "20px "
  },
  input: {
    width: "200px",
    height: "40px",
    textAlign: "center",
    borderRadius: "5px",
    overflow: "hidden",
    backgroundColor: "#eee",
    outline: "none !important",
    outlineWidth: "0 !important",
    boxShadow: "none",
    mozBoxShadow: "none",
    webkitBoxShadow: "none",
    border: "1px solid #3f51b5"
  },
  select: {
    paddingLeft: "10px"
  }
});

export default styles;

const styles = theme => ({
  back: {
    backgroundColor: "white"
  },
  superCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  input: {
    marginBottom: "20px",
    width: "300px",
    height: "40px",
    textAlign: "center",
    borderRadius: "5px",
    overflow: "hidden",
    backgroundColor: "white",
    outline: "none !important",
    outlineWidth: "0 !important",
    boxShadow: "none",
    mozBoxShadow: "none",
    webkitBoxShadow: "none",
    border: "1px solid blue"
  },
  label: {
    marginBottom: "20px",
    width: "300px",
    height: "40px",
    borderRadius: "5px",
    overflow: "hidden",
    backgroundColor: "#eee",
    border: "1px solid #3f51b5"
  },
  button: {
    outline: "none !important",
    outlineWidth: "0 !important",
    boxShadow: "none",
    mozBoxShadow: "none",
    webkitBoxShadow: "none",
    cursor: "pointer",
    marginTop: "10px",
    height: "40px",
    borderRadius: "5px",
    border: "1px solid #3f51b5",
    backgroundColor: "#e3f2fd",
    "&:hover": {
      backgroundColor: "#c5cae9"
    }
  },
  select: {
    paddingLeft: "10px"
  }
});

export default styles;

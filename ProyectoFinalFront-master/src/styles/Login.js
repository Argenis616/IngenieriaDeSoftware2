const styles = theme => ({
  background: {
    backgroundSize: "cover",
    backgroundImage: "url(../static/backprueba.jpg)",
    minHeight: "100vh",
    backgroundPosition: "center",
    backgroundRepreat: "no-repeat"
  },
  otraClase: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  superCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    marginBottom: "20px",
    width: "300px",
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
  titleContainer: {
    fontSize: "30px",
    color: "#3f51b5",
    marginBottom: "30px"
  },
  select: {
    paddingLeft: "10px"
  }
});

export default styles;

import React from "react";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  label: {
    display: "block"
  },
  superCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    width: "300px",
    height: "40px",
    paddingLeft: "10px",
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
  listbox: {
    width: "300px",
    margin: 0,
    padding: 0,
    zIndex: 1,
    position: "absolute",
    listStyle: "none",
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
    maxHeight: 200,
    border: "1px solid rgba(0,0,0,.25)",
    '& li[data-focus="true"]': {
      backgroundColor: "#4a8df6",
      color: "white",
      cursor: "pointer"
    },
    "& li:active": {
      backgroundColor: "#2977f5",
      color: "white"
    }
  }
}));

export default function UseAutocomplete(props) {
  const classes = useStyles();
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: props.books,
    getOptionLabel: option => option.name
  });

  return (
    <div>
      <div {...getRootProps()} style={{ width: "100%" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "10px"
          }}
        >
          <label className={classes.label} {...getInputLabelProps()}>
            Buscar libro:
          </label>
        </div>
        <input className={classes.input} {...getInputProps()} />
      </div>
      {groupedOptions.length > 0 ? (
        <ul className={classes.listbox} {...getListboxProps()}>
          {groupedOptions.map((option, index) => (
            <li
              {...getOptionProps({ option, index })}
              onClick={e => {
                props.showBook("searchedBook");
                props.setSearchedBook(option);
              }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

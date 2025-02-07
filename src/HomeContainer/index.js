import React, { Component } from "react";
import "./style.css";
import {
  AppBar,
  Button,
  FormControl,
  Typography,
  Toolbar,
  Select,
  FormHelperText,
  MenuItem,
  InputLabel
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import "react-table/react-table.css";
import * as firebase from "firebase";
import config from "../config.js";
import axios from "axios";
import MyTAble from "./table.js";
firebase.initializeApp(config);
const myDB = firebase.firestore();
const url = "https://6fcdce30.ngrok.io/";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      data: [
        { label: "Purchase Order" },
        { label: "Customer Name" },
        { label: "Phone Number" },
        { label: "Status" }
      ],
      data1: [],
      selected: [],
      selectValue: "",
      questions: []
    };
  }
  componentWillMount() {
    this.setState({ width: window.innerWidth });
  }
  componentDidMount() {
    const dbref = myDB.collection("groups");
    dbref.onSnapshot(snap => {
      let data = [];
      snap.forEach(function(doc) {
        let obj = doc.data();
        obj.id = doc.id;
        data.push(obj);
        console.log(data);
      });
      this.setState({ data1: data });
    });
    myDB
      .collection("questions")
      .doc("question")
      .get()
      .then(data => {
        console.log(data.data());
      })
      .catch(err => {
        console.log(err);
      });
  }
  getdata = () => {
    return myDB
      .collection("users")
      .get()
      .then(snapshot => {
        let data = [];
        snapshot.forEach(item => {
          let obj = item.data();
          obj.id = item.id;
          data.push(obj);
        });
        this.setState({ data1: data, selected: [] });
      })
      .catch(error => {
        console.log(error);
      });
  };
  onSelectAllClick = e => {
    let checked = e.target.checked;
    if (checked) {
      let data = [];
      this.state.data1.map((item, i) => {
        data.push(i);
      });
      this.setState({ selected: data });
    } else {
      this.setState({ selected: [] });
    }
  };
  makeCall = () => {
    let data = [];
    this.state.selected.map(item => {
      data.push(this.state.data1[item]);
    });

    axios({
      method: "POST",
      url: url + "call",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(result => console.log(result))
      .catch(err => console.log(err));
  };
  handleCheckbox = (e, i) => {
    let checked = e.target.checked;
    if (checked) {
      this.setState({ selected: [...this.state.selected, i] });
    } else {
      let arr = this.state.selected.filter(item => {
        return item != i;
      });
      this.setState({ selected: arr });
    }
  };
  handleModal = () => {
    this.setState({ open: false });
  };
  handleModal1 = () => {
    this.setState({ open1: false });
  };
  handleModal5 = () => {
    this.setState({ open5: false });
  };

  handleSelect = e => {
    this.setState({ selectValue: e.target.value });
  };
  openModal = () => {
    if (this.state.selected.length) {
      this.setState({ open: true });
    }
  };

  handleDateChange = date => {
    this.setState({ scheduleDate: date });
  };

  changingstate = e => {
    this.setState({ value: e.target.value });
  };

  keypress(e) {
    if (e.keypress === "Enter") {
      e.preventDefault();
      this.setState({ value: "" });
    }
  }

  reset() {
    this.setState({
      value: ""
    });
  }

  render() {
    console.log(this.state.data1);
    return (
      <div className={"homeContainer"}>
        <div className={""}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                Delivery Confirmation Portal
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <div>
          <FormControl required>
            <InputLabel id="demo-simple-select-required-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required"
              // value={age}
              // onChange={handleChange}
              // className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {this.state.data1.map(item => {
                return (
                  <MenuItem value="">
                    <em>{item["name"]}</em>
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        </div>
        <div className={"homeBody"}>
          <MyTAble
            handleCheckbox={this.handleCheckbox}
            onSelectAllClick={this.onSelectAllClick}
            data={this.state.data}
            data1={this.state.data1}
            selected={this.state.selected}
            handleDateChange={this.handleDateChange}
            getData={this.getdata}
          />
          <div />

          <div className={"submitDiv"}>
            <Button
              style={{ marginTop: "2%" }}
              variant="contained"
              color="primary"
              onClick={this.makeCall}
              className={"submitButton"}
            >
              Trigger Call
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mainstyle = theme => ({
  button: {
    marginRight: "10px",
    marginBottom: "10px"
  },
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    display: "block"
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },

  muipicker: {
    display: "block",
    width: "fit-content"
  },
  grid: {
    width: "100%",
    display: "block"
  }
});

export default withStyles(mainstyle)(Home);

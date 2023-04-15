import React, { Component } from "react";
import { render } from "react-dom";

export default class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
    }
}
console.log("Am i here?")
const appDiv = document.getElementById("app");
render(<App />, appDiv)
console.log("Am i here..")
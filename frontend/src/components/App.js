import React, { Component } from "react";
import { render } from "react-dom";
import RegisterUser from "./RegisterUser";
import Routing from "./Routing"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

function App () {
        return (
    <Router>
        <Routes>
            <Route path="/" element={<RegisterUser/>}/>
        </Routes>
    </Router>
)

}
console.log("Am i here?")
const appDiv = document.getElementById("app");
render(<App />, appDiv)
console.log("Am i here..")
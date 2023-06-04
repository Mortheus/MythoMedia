import React, {Component} from "react";
import {render} from "react-dom";
import Routing from "./Routing"
import {AuthProvider} from "./AuthContext";
import LoginForm from "./LoginForm";
import {BrowserRouter as Router, Routes, Route, Link, Redirect, Navigate} from "react-router-dom";


function App() {
    return (
        <>
            <Router>
                <Routing/>
            </Router>
        </>
    )

}

console.log("Am i here?")
const appDiv = document.getElementById("app");
render(<App/>, appDiv)
console.log("Am i here..")
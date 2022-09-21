import React from "react"
import ReactDOM from "react-dom"
import {RoverContextProvider} from "./data/roverContext"
import {BrowserRouter} from "react-router-dom"

import App from "./App"
import "./App.css"

ReactDOM.render(
    <RoverContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </RoverContextProvider>,
    document.getElementById("root")
)
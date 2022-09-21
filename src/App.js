import React from "react"
import {Routes, Route} from "react-router-dom"
import {RoverContext} from "./data/roverContext"

import Header from "./components/Header"
import RoverSelect from "./components/RoverSelect"


export default function App(){
    const {roverData} = React.useContext(RoverContext)
    const waitMessage = <h1 className="text-center">Fetching Data... <div className="spinner-border text-light" role="status"></div></h1>

    return (
        <main className="p-4 bg-space text-light">
            <Header />

            <Routes>
                <Route exact path="/" element={roverData ? <RoverSelect /> : waitMessage} />
            </Routes>
        </main>
    )
}
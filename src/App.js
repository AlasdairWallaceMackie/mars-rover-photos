import React from "react"
import {Routes, Route, Navigate} from "react-router-dom"

import { RoverContext } from "./data/roverContext"
import Home from "./pages/Home"
import RoverDetail from "./pages/RoverDetail"


export default function App(){
    const {roverData} = React.useContext(RoverContext)

    return (
        roverData.rovers ? 
            <main className="p-4 bg-space text-light">
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/rovers/" element={ <Navigate to="/" /> } />
                        <Route exact path="/rovers/:name" element={<RoverDetail />}/>
                    </Routes>
            </main> :
            <div className="loading-screen bg-space">
                <div className="spinner-border text-light" role="status"></div>
            </div>
    )
}
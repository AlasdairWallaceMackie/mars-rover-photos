import React from "react"
import {Routes, Route, Navigate} from "react-router-dom"

import { RoverContext } from "./data/roverContext"
import Home from "./pages/Home"
import RoverDetail from "./pages/RoverDetail"


export default function App(){
    const {roverData} = React.useContext(RoverContext)

    return (
        roverData ? 
            <main className="px-4 bg-space text-light">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/rovers/" element={<Navigate to="/" />} />
                        <Route path="/rovers/:name" element={<RoverDetail />}/>
                    </Routes>
            </main> :
            <div className="loading-screen bg-space">
                <div className="spinner-border text-light" role="status"></div>
            </div>
    )
}
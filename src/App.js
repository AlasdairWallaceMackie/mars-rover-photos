import React from "react"
import {Routes, Route} from "react-router-dom"

import Home from "./pages/Home"
import RoverDetail from "./pages/RoverDetail"


export default function App(){
    return (
        <main className="p-4 bg-space text-light">
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/rovers/:id" element={<RoverDetail />}/>
            </Routes>
        </main>
    )
}
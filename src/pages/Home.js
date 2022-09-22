import React from "react"

import {RoverContext} from "../data/roverContext"

import Header from "../components/Header"
import RoverSelect from "../components/RoverSelect"

export default function Home(){
    const {roverData} = React.useContext(RoverContext)
    const waitMessage = <h1 className="text-center">Fetching Data... <div className="spinner-border text-light" role="status"></div></h1>
    
    return (
        <>
            <Header />
            {roverData ? <RoverSelect /> : waitMessage}
        </>
    )
}
import React from "react"

import {RoverContext} from "../data/roverContext"
import roverProfileImageData from "../data/roverProfileImage"

import Rover from "./RoverProfile"


export default function RoverSelect(props){
    const {roverData} = React.useContext(RoverContext)
    const roverElements = roverData.map(rover => (
        <Rover 
            key={rover.id}
            name={rover.name}
            img={roverProfileImageData[rover.name]}
            rover={rover}
        />
    ))

    return (
        <div id="rover-select" className="text-center">
            <h1 className="rover-select--header">Select Rover:</h1>

            <div className="d-flex justify-content-around flex-wrap">
                {roverElements}
            </div>
        </div>
    )
}
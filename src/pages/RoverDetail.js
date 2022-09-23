import React from "react"
import {Link, useParams} from "react-router-dom"

import {RoverContext} from "../data/roverContext"

export default function RoverSelect(props){
    const {roverData} = React.useContext(RoverContext)
    const {name} = useParams()

    const rover = roverData.rovers.find(r => r.name.toLowerCase() === name)

    console.log("ROVER:")
    console.log(rover)

    return (
        <div className="full-height">
            {rover ? 
                <div>
                    <h1>Rover Detail Page</h1>
                    <h1>{rover.name}</h1>
                </div> :
                <div>
                    <h1>Rover Data Not Found</h1>
                    <Link to="/"><button className="btn btn-secondary">Back to Home</button></Link>
                </div>
            }
        </div>
        
    )
}
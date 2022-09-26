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
                    <Link to="/" className="animated-arrow animated-arrow-left">
                        <i className="ri-arrow-left-s-line ri-3x d-inline-block" />
                        <span className="fs-2">Back</span>
                    </Link>
                    <h1>Rover Detail Page</h1>
                    <h1>{rover.name}</h1>

                    <table className="table text-light">
                        <tbody>
                            <tr>
                                <td>Launch Date</td>
                                <td>{rover.launch_date}</td>
                            </tr>
                            <tr>
                                <td>Landing Date</td>
                                <td>{rover.landing_date}</td>
                            </tr>
                            <tr>
                                <td>Martian Days</td>
                                <td>{rover.max_sol}</td>
                            </tr>
                        </tbody>
                    </table>
                </div> :
                <div>
                    <h1>Rover Data Not Found</h1>
                    <Link to="/"><button className="btn btn-secondary">Back to Home</button></Link>
                </div>
            }
        </div>
        
    )
}
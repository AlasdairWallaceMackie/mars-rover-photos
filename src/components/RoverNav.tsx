import React from "react"
import {Link} from "react-router-dom"
import {nanoid} from "nanoid"

import {RoverData} from "../d"

type Props = {
    roverData: RoverData,
    currentRover: string,
}

export default function RoverNav(props: Props){

    const roverLinkElements = props.roverData.rovers.map(rover => (
        <li key={nanoid()}><Link
            to={`/rovers/${rover.name.toLowerCase()}`}
            className={`dropdown-item ${rover.name.toLowerCase()===props.currentRover ? "disabled" : ""}`}
        >
            {rover.name}
        </Link></li>
    ))

    return (
        <div id="rover-nav" className="dropdown">
            <button className="btn btn-lg btn-secondary dropdown-toggle" id="dropdownMenuLink" data-bs-toggle="dropdown">
                Rovers
            </button>

            <ul className="dropdown-menu">
                {roverLinkElements}
            </ul>
        </div>
    )
}
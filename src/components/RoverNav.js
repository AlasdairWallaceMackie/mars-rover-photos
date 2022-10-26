import React from "react"
import {Link} from "react-router-dom"

import {RoverContext} from "../data/roverContext"

export default function RoverNav(props){

    const roverLinkElements = props.roverData.rovers.map(rover => (
        <li><Link
            to={`/rovers/${rover.name.toLowerCase()}`}
            className={`dropdown-item ${rover.name.toLowerCase()===props.currentRover ? "disabled" : ""}`}
        >
            {rover.name}
        </Link></li>
    ))

    return (
        <div id="rover-nav" class="dropdown">
            <a class="btn btn-lg btn-secondary dropdown-toggle" href="#" id="dropdownMenuLink" data-bs-toggle="dropdown">
                Rovers
            </a>

            <ul class="dropdown-menu">
                {roverLinkElements}
            </ul>
        </div>
    )
}
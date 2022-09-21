import React from "react"
import {Link} from "react-router-dom"

import {RoverContext} from "../data/roverContext"
import roverProfileImageData from "../data/roverProfileImage"

export default function RoverProfile(props){
    return (
        <Link to={`/rovers/${props.name.toLowerCase()}/`} className="rover mb-5">
            <h1 className="rover--header">{props.name}</h1>

            <img src={props.img} className="rounded-3"></img>
        </Link>
    )
}

RoverProfile.defaultProps = {
    img: roverProfileImageData.default
}
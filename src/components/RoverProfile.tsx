import React from "react"
import {Link} from "react-router-dom"

import roverProfileImageData from "../data/roverProfileImages"
import {Rover} from "../d"

type StyleClasses = {
    "active": string,
    "complete": string,
    "unknown": string,
}
type Props = {
    name: string,
    img: string,
    rover: Rover,
}

export default function RoverProfile(props: Props){
    const roverStatus = props.rover.status

    const statusIndicatorClasses: StyleClasses = {
        "active": "spinner-grow spinner-grow-sm mt-2",
        "complete": "ri-checkbox-blank-circle-fill ri-xs mt-1",
        "unknown": "ri-checkbox-blank-circle-fill ri-xs mt-1",
    }
    const statusColorClass: StyleClasses = {
        "active": "text-success-bright",
        "complete": "text-danger",
        "unknown": "text-warning",
    }

    const statusIndicatorElement = <>
        <h3 className={`d-flex mt-2 justify-content-center ${statusColorClass[roverStatus as keyof StyleClasses]}`}>
            <div className={statusIndicatorClasses[roverStatus as keyof StyleClasses]}></div>
            <span className="ms-2">Status: {roverStatus.toUpperCase()}</span>
        </h3>
    </>




    return (
        <Link to={`/rovers/${props.name.toLowerCase()}/`} className="rover mb-3">
            <h1 className="rover--header">{props.name}</h1>
            <img src={props.img} className="rounded-3" alt={props.name} ></img>

            {statusIndicatorElement}
            {roverStatus === "complete" && <h4><>Last Contact: {props.rover.max_date}</></h4>}
            {roverStatus === "active" && <h4>Martian Days: {props.rover.max_sol}</h4>}
        </Link>
    )
}

RoverProfile.defaultProps = {
    img: roverProfileImageData.default,
    rover: {
        status: "unknown"
    }
}
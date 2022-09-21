import React from "react"

import marsPhoto from "../img/mars.png"

export default function Header(props){
    return (
        <header className="pt-5 text-center">
            <div>
                <h1 className="header--title">Welcome to Mars</h1>
                <h2 className="header--subtitle">Explore photos from NASA's Mars rovers</h2>
                <a className="down-arrow" href="#rover-select">
                    <i className="ri-arrow-down-s-line ri-3x" />
                </a>
            </div>
            <img className="mt-md-5" src={marsPhoto} alt="Mars"/>
        </header>
    )
}
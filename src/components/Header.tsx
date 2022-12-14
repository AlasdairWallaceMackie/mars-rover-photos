import React from "react"
import FadeIn from "react-fade-in"


import marsPhoto from "../img/mars.png"

export default function Header(){
    return (
        <header className="pt-5 text-center">
            <FadeIn transitionDuration={1000}>
                <h1 className="header--title">Welcome to Mars</h1>
                <h2 className="header--subtitle">Explore photos from NASA's Mars rovers</h2>
                <a className="animated-arrow animated-arrow-down" href="#rover-select">
                    <i className="ri-arrow-down-s-line ri-3x" />
                </a>
                <br/>
                <img className="mt-md-5" src={marsPhoto} alt="Mars"/>
            </FadeIn>
        </header>
    )
}
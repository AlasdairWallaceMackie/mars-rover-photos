import React from "react"

import marsPhoto from "./img/mars.png"

export default function App(){
    return (
        <main className="p-4 bg-space text-center text-white">
            <header className="pt-5">
                <div>
                    <h1 className="header--title">Welcome to Mars</h1>
                    <h2 className="header--subtitle">Explore photos from NASA's Mars rovers</h2>
                    <a className="down-arrow" href="#home">
                        <i className="ri-arrow-down-s-line ri-3x" />
                    </a>
                </div>
                <img className="mt-5" src={marsPhoto}/>
            </header>

            <content id="home">
                <h1>Home</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at interdum quam. In ultricies leo a est interdum ultricies. Sed eget purus varius, porta felis sed, convallis justo. Morbi vulputate, purus non auctor scelerisque, purus tortor elementum neque, sed porttitor odio nunc quis augue. Donec augue velit, pretium at eros eu, tempus ornare enim. Integer vestibulum laoreet ex, sit amet cursus metus eleifend id. Vivamus eget pulvinar leo. Nulla nibh turpis, dignissim et eleifend nec, maximus vel arcu. Aliquam erat volutpat. Nullam laoreet metus id eleifend mattis. Sed facilisis quam quis dui varius sodales. Maecenas tellus elit, sodales eu vulputate sit amet, pulvinar vitae dolor. Nam condimentum sodales ultricies. Nunc congue ullamcorper orci sed venenatis. Nulla hendrerit ac eros vel porttitor.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at interdum quam. In ultricies leo a est interdum ultricies. Sed eget purus varius, porta felis sed, convallis justo. Morbi vulputate, purus non auctor scelerisque, purus tortor elementum neque, sed porttitor odio nunc quis augue. Donec augue velit, pretium at eros eu, tempus ornare enim. Integer vestibulum laoreet ex, sit amet cursus metus eleifend id. Vivamus eget pulvinar leo. Nulla nibh turpis, dignissim et eleifend nec, maximus vel arcu. Aliquam erat volutpat. Nullam laoreet metus id eleifend mattis. Sed facilisis quam quis dui varius sodales. Maecenas tellus elit, sodales eu vulputate sit amet, pulvinar vitae dolor. Nam condimentum sodales ultricies. Nunc congue ullamcorper orci sed venenatis. Nulla hendrerit ac eros vel porttitor.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at interdum quam. In ultricies leo a est interdum ultricies. Sed eget purus varius, porta felis sed, convallis justo. Morbi vulputate, purus non auctor scelerisque, purus tortor elementum neque, sed porttitor odio nunc quis augue. Donec augue velit, pretium at eros eu, tempus ornare enim. Integer vestibulum laoreet ex, sit amet cursus metus eleifend id. Vivamus eget pulvinar leo. Nulla nibh turpis, dignissim et eleifend nec, maximus vel arcu. Aliquam erat volutpat. Nullam laoreet metus id eleifend mattis. Sed facilisis quam quis dui varius sodales. Maecenas tellus elit, sodales eu vulputate sit amet, pulvinar vitae dolor. Nam condimentum sodales ultricies. Nunc congue ullamcorper orci sed venenatis. Nulla hendrerit ac eros vel porttitor.</p>
            </content>
        </main>
    )
}
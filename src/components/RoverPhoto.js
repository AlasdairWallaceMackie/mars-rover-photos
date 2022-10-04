import React from "react"

export default function RoverPhoto(props){
    const photo = props.photo

    return (
        <div className="rover-photo my-auto">
            <img
                src={photo.img_src} 
                alt={`[${photo.camera.name}] -- ID: ${photo.id}`}
                data-index={props.index}
                onClick={props.handleClick}
            />
        </div>
    )
}
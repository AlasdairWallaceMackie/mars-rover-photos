import React from "react"

import {Photo} from "../d"

type Props = {
    photo: Photo,
    index: number,
    handleClick: React.MouseEventHandler
}

export default function RoverPhoto(props: Props){
    const photo = props.photo

    return (
        <div className="rover-photo my-auto">
            <img
                src={photo.img_src} 
                alt={`[${photo.camera.name}] -- ID: ${photo.id}`}
                data-index={props.index}
                onClick={props.handleClick}
            />
            {/* <p>{photo.earth_date.toString()}</p> */}
        </div>
    )
}
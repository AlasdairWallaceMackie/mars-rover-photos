import React from "react"

export default function RoverPhoto(props){
    const photo = props.photo

    return (
        <div className="rover-photo">
            <p>ID: {photo.id} -- {photo.camera.full_name}</p>
            <img src={photo.img_src} style={{width: "500px"}} alt={`[${photo.camera.name}] -- ID: ${photo.id}`}/>
            <hr className="hr" />
        </div>
    )
}
import React from "react"

export default function CameraButton(props){
    const labelClass = props.disabled ? "btn-outline-secondary" : "btn-light border"
    const cameraName = props.camera.name
    const inputId = `${cameraName}-checkbox`

    return (
        <>
            <input
                type="checkbox"
                className="btn-check"
                id={inputId}
                value={cameraName}
                onChange={props.handleCameraSelect} 
                checked={props.selected}
                disabled={props.disabled}
            />
            <label
                className={`btn ${labelClass}`}
                htmlFor={inputId}
                title={props.camera.full_name}
            >
                {cameraName}
            </label>
        </>
    )
}
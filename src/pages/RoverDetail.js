import React from "react"
import {Link, useParams} from "react-router-dom"
import {nanoid} from "nanoid"

import {RoverContext} from "../data/roverContext"
import RoverPhoto from "../components/RoverPhoto"
import CameraButton from "../components/CameraButton"

export default function RoverSelect(props){
    const {roverData} = React.useContext(RoverContext)
    const {name} = useParams()
    const rover = roverData.rovers.find(r => r.name.toLowerCase() === name)

    const [earthDate, setEarthDate] = React.useState("")
    const [photoData, setPhotoData] = React.useState([])
    const [shownPhotos, setShownPhotos] = React.useState([])
    const [currentFocusIndex, setCurrentFocusIndex] = React.useState(0)
    const [showZoom, setShowZoom] = React.useState(false)
    const [cameras, setCameras] = React.useState(rover.cameras.map(c => (
        {
            cameraObj: c,
            selected: false,
        }
    )))
    const [firstFetch, setFirstFetch] = React.useState(false)


    const cameraButtons = cameras.map(c => {
        const camera = c.cameraObj

        const hasPhotos = photoData.find(photo => photo.camera.name === camera.name) ? true : false
        
        return (
            <CameraButton 
                key={nanoid()}
                camera={camera}
                handleCameraSelect={handleCameraSelect}
                disabled={!hasPhotos}
                selected={c.selected}
            />
        )
    })
    
    let photoDataElements = firstFetch ? <h2>No photos found for that date</h2> : <h2>Select an Earth date to get photographs</h2>

    if (photoData.length){
        photoDataElements = shownPhotos.map((photo, index) => (
            <RoverPhoto 
                key={photo.id}
                photo={photo}
                index={index}
                handleClick={handlePhotoClick}
            />
        ))
    }






    function handleCameraSelect(event){
        const value = event.target.value
        const newCameraSet = cameras.map(camera => (
            {
                ...camera,
                selected: camera.cameraObj.name === value ? !camera.selected : camera.selected,
            }
        ))

        setCameras(newCameraSet)
        
        const cameraNames = []
        for (var i=0; i<newCameraSet.length; i++){
            if (newCameraSet[i].selected)
                cameraNames.push(newCameraSet[i].cameraObj.name)
        }

        setShownPhotos(photoData.filter(photo => cameraNames.includes(photo.camera.name)))
    }

    function handleChangeEarthDate(event){
        setEarthDate(event.target.value)
    }

    function handleSubmit(event){
        event.preventDefault()

        fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/${rover.name}/photos?earth_date=${earthDate}`)
            .then(response => response.json())
            .then(data => setPhotoData(data.photos))
        
        setFirstFetch(true)
    }

    function handlePhotoClick(event){
        const newIndex = event.target.dataset.index
        setCurrentFocusIndex(newIndex)
        setShowZoom(true)
    }









    return (
        <div className="full-height">
            {rover ? 
                <div className="py-3 position-relative">
                    <Link to="/" className="animated-arrow animated-arrow-left position-absolute d-flex">
                        <i className="ri-arrow-left-s-line ri-3x" />
                        <span className="fs-2 mt-3">Back</span>
                    </Link>

                    <h1 className="rover-title mb-4">{rover.name}</h1>

                    <table className="table text-light">
                        <tbody>
                            <tr>
                                <td>Launch Date</td>
                                <td>{rover.launch_date}</td>
                            </tr>
                            <tr>
                                <td>Landing Date</td>
                                <td>{rover.landing_date}</td>
                            </tr>
                            <tr>
                                <td>Martian Days on the planet</td>
                                <td>{rover.max_sol}</td>
                            </tr>
                            <tr>
                                <td>Photos Available</td>
                                <td>{rover.total_photos}</td>
                            </tr>
                        </tbody>
                    </table>

                    <br/>

                    <form onSubmit={handleSubmit}>
                        <h1>PHOTOS</h1>

                        <div className="d-flex mb-5 col-8 col-md-5">
                            <div className="input-group me-3">
                                <span className="input-group-text" htmlFor="earth-date">Earth Date</span>
                                <input
                                    id="earth-date"
                                    type="date"
                                    min={rover.launch_date}
                                    max={rover.max_date}
                                    onChange={event => handleChangeEarthDate(event)}
                                    required={true}
                                    className="form-control"
                                />
                            </div>
                            <input type="submit" className="btn btn-secondary"/>
                        </div>
                    </form>

                    {firstFetch ?
                        <>
                            <h2 className="text-center">CAMERAS</h2>
                            <div className="btn-group d-flex flex-wrap">
                                {cameraButtons}
                            </div>

                            {/* //TODO "Select All"/"Select None" buttons */}

                            <p className="my-3">Showing {shownPhotos.length} out of {photoData.length} photos</p>
                        </> :
                        <></>
                    }

                    <div className="container-fluid d-flex flex-wrap">
                        {photoDataElements}
                    </div>
                
                    {(shownPhotos.length && showZoom) ? 
                        <div id="zoom-window" onClick={() => setShowZoom(false)}>
                            <img src={shownPhotos[currentFocusIndex].img_src} alt="" />
                        </div> :
                        <></>
                    }
                    {/* //TODO: Add arrows to cycle through photos */}
                </div> 

                //TODO: Button to return to top of page

                //TODO: Pagination?
                
                
                
                
                
                :<div>
                    <h1>Rover Data Not Found</h1>
                    <Link to="/"><button className="btn btn-secondary">Back to Home</button></Link>
                </div>
            }
        </div>
    )
}
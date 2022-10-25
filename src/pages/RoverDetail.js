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
    const [cameras, setCameras] = React.useState([])
    const [firstFetch, setFirstFetch] = React.useState(false)

    React.useEffect(() => {
        setCameras(rover.cameras.map(c => {
            const hasPhotos = photoData.find(photo => photo.camera.name === c.name) ? true : false
            
            return {
                cameraObj: c,
                disabled: !hasPhotos,
                selected: false,
            }
        }))
    }, [photoData])

    React.useEffect(() => {
        let cameraNames = cameras.map(camera => camera.selected ? camera.cameraObj.name : "")        
        setShownPhotos(photoData.filter(photo => cameraNames.includes(photo.camera.name)))
    }, [cameras])

    React.useEffect(() => {
        document.addEventListener('keydown', keyPress)
        return () => document.removeEventListener('keydown', keyPress)
    }, [keyPress])

    const cameraButtons = cameras.map(c => {        
        return (
            <CameraButton 
                key={nanoid()}
                camera={c.cameraObj}
                handleCameraSelect={handleCameraSelect}
                disabled={c.disabled}
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

    const returnToTopButton = shownPhotos.length ? 
        <a href="#rover-detail" className="d-flex justify-content-center text-decoration-none my-5">
            <button className="btn btn-lg btn-light">Return to Top</button>
        </a> :
        <></>






    function handleCameraSelect(event){
        const value = event.target.value

        setCameras(cameras.map(camera => {
            const hasPhotos = photoData.find(photo => photo.camera.name === camera.cameraObj.name) ? true : false

            return {
                ...camera,
                disabled: !hasPhotos,
                selected: camera.cameraObj.name === value ? !camera.selected : camera.selected,
            }
        }))
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

    function handleMostRecentDayClick(){
        let input = document.getElementById("earth-date")
        let maxDate = input.getAttribute("max")

        input.value = maxDate
        setEarthDate(maxDate)
    }

    function selectAllCameras(setting){
        if (setting === true || setting === false){
            setCameras(prevState => prevState.map(c => (
                {
                    ...c,
                    selected: c.disabled ? false : setting
                }
            )))
        }
        else
            console.log("ERROR, selectAllCameras missing parameter")
    }

    function handleChangePicture(value){
        //Value should be +/- 1
        setCurrentFocusIndex(prevIndex => {
            let newValue = parseInt(prevIndex) + parseInt(value)

            if (newValue < 0)
                return 0
            else if (newValue >= shownPhotos.length)
                return shownPhotos.length-1
            else
                return newValue
        })
    }

    function keyPress(event){
        if (showZoom){
            switch (event.key){
                case 'ArrowLeft': handleChangePicture(-1); break;
                case 'ArrowRight': handleChangePicture(1); break;
                case 'Escape': setShowZoom(false); break;
            }
        }
    }







    return (
        <div className="full-height">
            {rover ? 
                <div id="rover-detail" className="py-3 position-relative">
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

                        <div className="d-flex mb-5 col-8 col-md-6 flex-wrap flex-sm-nowrap justify-content-center justify-content-sm-none">
                            <div className="input-group me-3 mb-3 mb-sm-0">
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
                            <button type="button" className="btn btn-light ms-2 text-nowrap" onClick={handleMostRecentDayClick}>Most Recent</button>
                        </div>
                    </form>

                    {firstFetch ?
                        <>
                            <h2 className="text-center">CAMERAS</h2>
                            <div className="btn-group d-flex flex-wrap">
                                {cameraButtons}
                            </div>

                            <div className="d-flex justify-content-center mt-3">
                                <div className="btn-group">
                                    <button className="btn btn-light border" onClick={() => selectAllCameras(true)}>Select All</button>
                                    <button className="btn btn-light border" onClick={() => selectAllCameras(false)}>Select None</button>
                                </div>
                            </div>

                            <p className="my-3">Showing {shownPhotos.length} out of {photoData.length} photos</p>
                        </> :
                        <></>
                    }

                    <div className="container-fluid d-flex flex-wrap justify-content-center">
                        {photoDataElements}
                    </div>
                
                    {(shownPhotos.length && showZoom) ? 
                        <div id="zoom-window">
                            <div className="position-relative">
                                <img src={shownPhotos[currentFocusIndex].img_src} alt="" />
                                <i 
                                    className="ri-close-fill ri-3x zoom-window--close" 
                                    onClick={() => setShowZoom(false)}    
                                />
                                <i 
                                    className="ri-arrow-left-s-line ri-3x zoom-window--arrow-left" 
                                    onClick={() => handleChangePicture(-1)}
                                />
                                <i 
                                    className="ri-arrow-right-s-line ri-3x zoom-window--arrow-right" 
                                    onClick={() => handleChangePicture(1)}
                                />
                            </div>
                        </div> :
                        <></>
                    }

                    {returnToTopButton}
                </div>
                //TODO: Pagination?
                
                
                
                
                
                :<div>
                    <h1>Rover Data Not Found</h1>
                    <Link to="/"><button className="btn btn-secondary">Back to Home</button></Link>
                </div>
            }
        </div>
    )
}
import React, { SyntheticEvent } from "react"
import {Link, useParams} from "react-router-dom"
import {nanoid} from "nanoid"

import {RoverContext} from "../data/roverContext"
import RoverPhoto from "../components/RoverPhoto"
import RoverNav from "../components/RoverNav"
import CameraButton from "../components/CameraButton"

import {Rover, Photo, ContextInterface, Camera} from "../d"

interface EventInterface extends SyntheticEvent{
    dataset?: any,
    key?: string,
}

export default function RoverDetail(){
    const {roverData} = React.useContext<ContextInterface>(RoverContext)
    const {name} = useParams<string>()
    const rover: Rover = roverData.rovers.find(r => r.name.toLowerCase() === name)!

    const [earthDate, setEarthDate] = React.useState<Date | string>("")
    const [photoData, setPhotoData] = React.useState<Photo[]>([])
    const [shownPhotos, setShownPhotos] = React.useState<Photo[]>([])
    const [currentFocusIndex, setCurrentFocusIndex] = React.useState<number>(0)
    const [showZoom, setShowZoom] = React.useState<boolean>(false)
    const [cameras, setCameras] = React.useState<Camera[]>([])
    const [firstFetch, setFirstFetch] = React.useState<boolean>(false)

    const [loaded, setLoaded] = React.useState<boolean>(false)
    const [notLoadedElement, setNotLoadedElement] = React.useState(
        <div className="loading-screen bg-space">
            <div className="spinner-border text-light" role="status"></div>
        </div>
    )

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
    
    let photoDataElements: React.ReactElement[] | JSX.Element = firstFetch ? <h2>No photos found for that date</h2> : <h2>Select an Earth date to get photographs</h2>

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




    React.useEffect(() => {
        if (loaded === false){
            const timer = setTimeout(() => {
                setNotLoadedElement(
                    <div className="text-center">
                        <h1>API Request Timeout: Rover Data Not Found</h1>
                        <Link to="/"><button className="btn btn-secondary">Back to Home</button></Link>
                    </div>
                )
                setLoaded(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [loaded])

    React.useEffect(() => {
        setPhotoData([])
        setFirstFetch(false)
    }, [name])

    React.useEffect(() => {
        if (rover && "cameras" in rover){
            setLoaded(true)

            setCameras(rover.cameras.map(c => {
                const hasPhotos = photoData.find(photo => photo.camera.name === c.name) ? true : false
                
                return {
                    cameraObj: c,
                    disabled: !hasPhotos,
                    selected: false,
                } as Camera
            }))
        }
    }, [photoData, rover])

    React.useEffect(() => {
        let cameraNames = cameras.map(camera => camera.selected ? camera.cameraObj.name : "")        
        setShownPhotos(photoData.filter(photo => cameraNames.includes(photo.camera.name)))
    }, [cameras, photoData])





    const handleChangePicture = React.useCallback((value: -1|1) => {
        setCurrentFocusIndex(prevIndex => {
            let newValue = parseInt(prevIndex.toString()) + parseInt(value.toString())

            if (newValue < 0)
                return 0
            else if (newValue >= shownPhotos.length)
                return shownPhotos.length-1
            else
                return newValue
        })
    }, [shownPhotos.length])

    React.useEffect(() => {
        document.addEventListener('keydown', keyPress)
        return () => document.removeEventListener('keydown', keyPress)

        function keyPress(event: KeyboardEvent){
            if (showZoom){
                switch (event.key){
                    case 'ArrowLeft': handleChangePicture(-1); break;
                    case 'ArrowRight': handleChangePicture(1); break;
                    case 'Escape': setShowZoom(false); break;
                    default: break;
                }
            }
        }
    }, [handleChangePicture, showZoom])








    function handleCameraSelect(event: EventInterface){
        const target = event.target as HTMLInputElement
        const value = target.value

        setCameras(cameras.map(camera => {
            const hasPhotos = photoData.find(photo => photo.camera.name === camera.cameraObj.name) ? true : false

            return {
                ...camera,
                disabled: !hasPhotos,
                selected: camera.cameraObj.name === value ? !camera.selected : camera.selected,
            } as Camera
        }))
    }

    function handleChangeEarthDate(event: EventInterface){
        const target = event.target as HTMLInputElement
        setEarthDate(target.value)
    }

    function handleSubmit(event: SyntheticEvent){
        event.preventDefault()

        fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/${rover.name}/photos?earth_date=${earthDate}`)
            .then(response => response.json())
            .then(data => setPhotoData(data.photos))
        
        setFirstFetch(true)
    }

    function handlePhotoClick(event: EventInterface){
        const target = event.target as HTMLElement
        const newIndex = target.dataset.index as unknown as number
        setCurrentFocusIndex(newIndex)
        setShowZoom(true)
    }

    function handleMostRecentDayClick(){
        let input = document.getElementById("earth-date") as HTMLInputElement
        let maxDate = input!.getAttribute("max") as string

        input.value = maxDate
        setEarthDate(maxDate)
    }

    function selectAllCameras(setting: boolean){
        setCameras(prevState => prevState.map(c => (
            {
                ...c,
                selected: c.disabled ? false : setting
            } as Camera
        )))
    }








    return (
        <div className="full-height">
            {loaded ? 
                <div id="rover-detail" className="py-3 position-relative">
                    <Link to="/" className="animated-arrow animated-arrow-left position-absolute d-flex">
                        <i className="ri-arrow-left-s-line ri-3x" />
                        <span className="fs-2 mt-3">Back</span>
                    </Link>

                    <h1 className="rover-title mb-4 mt-5 mt-md-0">{rover.name}</h1>

                    <RoverNav
                        roverData={roverData}
                        currentRover={name!}
                    />

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
                                <label className="input-group-text" htmlFor="earth-date">Earth Date</label>
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
                                {currentFocusIndex != 0 ?
                                    <i 
                                        className="ri-arrow-left-s-line ri-3x zoom-window--arrow-left" 
                                        onClick={() => handleChangePicture(-1)}
                                    /> :
                                    <></>
                                }
                                {currentFocusIndex != shownPhotos.length-1 ?
                                    <i 
                                    className="ri-arrow-right-s-line ri-3x zoom-window--arrow-right" 
                                    onClick={() => handleChangePicture(1)}
                                    /> :
                                    <></>
                                }
                                
                            </div>
                        </div> :
                        <></>
                    }

                    {returnToTopButton}
                </div>
                
                :<>{notLoadedElement}</>
                
            }
        </div>
    )
}
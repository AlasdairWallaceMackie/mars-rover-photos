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

    const [earthDate, setEarthDate] = React.useState<Date>(new Date())
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
        <a href="#rover-detail" className="return-to-top-button bg-light">
            {/* <i className="ri-arrow-up-s-line ri-3x"></i> */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z"/></svg>
        </a> :
        <></>


    // console.log(roverData)
    // console.log(photoData)


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

    function handleChangeEarthDateInterval(value: 1 | -1){
        let newDate = new Date(earthDate.getFullYear(), earthDate.getMonth(), earthDate.getUTCDate())
        newDate.setDate(newDate.getUTCDate() + value)

        let input = document.getElementById("earth-date") as HTMLInputElement
        input.value = parseDateFormat(newDate)

        setEarthDate(newDate)
        handleSubmit()
    }

    function handleSubmit(event?: SyntheticEvent){
        if (event)
            event.preventDefault()

        const input = document.getElementById("earth-date") as HTMLInputElement
        const inputDate = new Date(input.value)

        // console.log("Earth Date:" + earthDate)
        // console.log("FETCH FROM:")
        // console.log(`https://mars-photos.herokuapp.com/api/v1/rovers/${rover.name}/photos?earth_date=${parseDateFormat(inputDate)}`)

        fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/${rover.name}/photos?earth_date=${parseDateFormat(inputDate)}`)
            .then(response => response.json())
            .then(data => setPhotoData(data.photos))
        
        setFirstFetch(true)
        setEarthDate(inputDate)
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
        setEarthDate(new Date(maxDate))
        handleSubmit()
    }

    function handleLandingDateClick(){
        let input = document.getElementById("earth-date") as HTMLInputElement
        const landing_date = rover.landing_date


        input.value = landing_date
        setEarthDate(new Date(landing_date))
        handleSubmit()
    }

    function selectAllCameras(setting: boolean){
        setCameras(prevState => prevState.map(c => (
            {
                ...c,
                selected: c.disabled ? false : setting
            } as Camera
        )))
    }






    function atBookendDate(type: "start"|"end"){
        switch(type){
            case "start": return earthDate.getTime() <= Date.parse(rover.landing_date)
            case "end":   return earthDate.getTime() >= Date.parse(rover.max_date)
        }
    }

    function parseDateFormat(date: Date){
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getUTCDate()

        return `${year}-${month <= 9 ? "0" : ""}${month}-${day <= 9 ? "0" : ""}${day}`
    }

    function getPrettyDate(date: Date|string){
        if (typeof date == "string")
            date = new Date(date)

        return date.toUTCString().split(' ').slice(0, 4).join(' ')
    }







    return (
        <div className="full-height">
            {loaded ? 
                <div id="rover-detail" className="py-3 position-relative">
                    <Link to="/" className="animated-arrow animated-arrow-left position-absolute d-flex">
                        <i className="ri-arrow-left-s-line ri-3x" />
                        <span className="fs-2 mt-3">Back</span>
                    </Link>

                    <h1 id="rover--title" className="display-1 text-center mb-4 mt-5 mt-md-0">{rover.name}</h1>

                    <RoverNav
                        roverData={roverData}
                        currentRover={name!}
                    />

                    <div className="d-flex justify-content-evenly flex-wrap-reverse">
                        <form onSubmit={handleSubmit} className="my-auto">    
                            <div className="input-group me-3 mb-3 mb-sm-0">
                                <label className="input-group-text" htmlFor="earth-date">Earth Date</label>
                                <input
                                    id="earth-date"
                                    type="date"
                                    min={rover.landing_date}
                                    max={rover.max_date}
                                    required={true}
                                    className="form-control"
                                />
                            </div>
                            <div className="d-flex justify-content-around mt-3">
                                <input type="submit" className="btn btn-secondary"/>
                                <button type="button" className="btn btn-light ms-2 text-nowrap" onClick={handleMostRecentDayClick}>Most Recent</button>
                            </div>
                        </form>

                        <div className="mb-3 mb-md-0">
                            <table className="table text-light">
                                <tbody>
                                    <tr>
                                        <td>Launch Date</td>
                                        <td>{getPrettyDate(rover.launch_date)}</td>
                                    </tr>
                                    <tr>
                                        <td>Landing Date</td>
                                        <td>{getPrettyDate(rover.landing_date)}</td>
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
                        </div>
                    </div>

                    <br/>

                    {firstFetch ?
                        <>
                            {/* //TODO: Make this look better on mobile */}
                            <div className="d-flex justify-content-center mb-4">
                                <button 
                                    className="btn btn-outline-light bg-blur mx-3 text-nowrap"
                                    type="button"
                                    onClick={handleLandingDateClick}
                                    disabled={atBookendDate("start")}
                                >
                                    <i className="ri-rewind-mini-fill align-bottom mx-1"></i>
                                    Landing Date
                                </button>
                                <div className="btn-group bg-blur">
                                    <button
                                        className="btn btn-outline-light border"
                                        onClick={() => handleChangeEarthDateInterval(-1)}
                                        disabled={atBookendDate("start")}
                                    >
                                        <i className="ri-arrow-left-s-line align-bottom"></i>
                                        Prev Day
                                    </button>
                                    <h2 className="border border-light text-center m-0 px-3 py-1">{getPrettyDate(earthDate)}</h2>
                                    <button
                                        className="btn btn-outline-light border" 
                                        onClick={() => handleChangeEarthDateInterval(1)}
                                        disabled={atBookendDate("end")}
                                    >
                                        Next Day
                                        <i className="ri-arrow-right-s-line align-bottom"></i>
                                    </button>
                                </div>
                                <button
                                    className="btn btn-outline-light bg-blur mx-3 text-nowrap"
                                    type="button"
                                    onClick={handleMostRecentDayClick}
                                    disabled={atBookendDate("end")}
                                >
                                    Most Recent
                                    <i className="ri-speed-mini-fill align-bottom mx-1"></i>
                                </button>
                            </div>
                            <h2 className="text-center">CAMERAS</h2>
                            <div className="btn-group d-flex flex-wrap bg-blur">
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

                    <div className="container-fluid d-flex flex-wrap justify-content-center text-center">
                        {photoDataElements}
                    </div>
                
                    {(shownPhotos.length && showZoom) ? 
                        <div id="zoom-background" className="d-flex justify-content-center">
                            <div id="zoom-window">
                                <img src={shownPhotos[currentFocusIndex].img_src} alt="" />
                                <i 
                                    className="ri-close-fill ri-3x zoom-window--close" 
                                    onClick={() => setShowZoom(false)}    
                                />
                                {currentFocusIndex !== 0 ?
                                    <i 
                                        className="ri-arrow-left-s-line ri-3x zoom-window--arrow-left" 
                                        onClick={() => handleChangePicture(-1)}
                                    /> :
                                    <></>
                                }
                                {currentFocusIndex !== shownPhotos.length-1 ?
                                    <i 
                                    className="ri-arrow-right-s-line ri-3x zoom-window--arrow-right" 
                                    onClick={() => handleChangePicture(1)}
                                    /> :
                                    <></>
                                }
                                <div className="dropdown zoom-window--info-dropdown">
                                    <i className="dropdown-toggle ri-information-fill ri-3x" data-bs-toggle="dropdown"></i>
                                    <div className="dropdown-menu shadow p-3 text-nowrap">
                                        <table>
                                            <tbody>
                                                <tr className="border-bottom">
                                                    <td>CAMERA</td>
                                                    <td>{shownPhotos[currentFocusIndex].camera.full_name}</td>
                                                </tr>
                                                <tr className="border-bottom">
                                                    <td>EARTH DATE</td>
                                                    <td>{shownPhotos[currentFocusIndex].earth_date.toString()}</td>
                                                </tr>
                                                <tr className="border-bottom">
                                                    <td className="pe-4">MARS DAY</td>
                                                    <td>{shownPhotos[currentFocusIndex].sol}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
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
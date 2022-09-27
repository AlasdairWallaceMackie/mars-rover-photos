import React from "react"
import {Link, useParams} from "react-router-dom"

import {RoverContext} from "../data/roverContext"

export default function RoverSelect(props){
    const {roverData} = React.useContext(RoverContext)
    const {name} = useParams()
    const rover = roverData.rovers.find(r => r.name.toLowerCase() === name)

    const [earthDate, setEarthDate] = React.useState("")
    const [photoData, setPhotoData] = React.useState([])
    let photoDataElements = <h2>Select an Earth date to get photographs</h2>



    // console.log(rover)

    function handleChange(event){
        setEarthDate(event.target.value)
    }

    function handleSubmit(event){
        event.preventDefault()

        fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/${rover.name}/photos?earth_date=${earthDate}`)
            .then(response => response.json())
            .then(data => setPhotoData(data.photos))
    }

    console.log("EARTH DATE: " + earthDate)
    console.log("Photo Data: " + JSON.stringify(photoData))

    if (photoData.length){
        photoDataElements = photoData.map(photo => (
            <div>
                <p>ID: {photo.id} -- {photo.camera.full_name}</p>
                <img src={photo.img_src} style={{width: "500px"}}/>
                <hr className="hr" />
            </div>
        ))
    }


    return (
        <div className="full-height">
            {rover ? 
                <div>
                    <Link to="/" className="animated-arrow animated-arrow-left">
                        <i className="ri-arrow-left-s-line ri-3x d-inline-block" />
                        <span className="fs-2">Back</span>
                    </Link>
                    <h1>Rover Detail Page</h1>
                    <h1>{rover.name}</h1>

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

                        <div className="d-flex mb-5">
                            <input
                                type="date"
                                min={rover.launch_date}
                                max={rover.max_date}
                                onChange={event => handleChange(event)}
                                required={true}
                                className="form-control me-3"
                                style={{width: "200px"}}
                            />
                            <input type="submit" className="btn btn-secondary"/>
                        </div>
                    </form>

                    {photoDataElements}
                </div> :
                <div>
                    <h1>Rover Data Not Found</h1>
                    <Link to="/"><button className="btn btn-secondary">Back to Home</button></Link>
                </div>
            }
        </div>
        
    )
}
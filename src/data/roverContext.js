import React from "react"

const RoverContext = React.createContext()

function RoverContextProvider(props){
    const [roverData, setRoverData] = React.useState([])

    React.useEffect(() => {
        fetch("https://mars-photos.herokuapp.com/api/v1/rovers/")
            .then(response => response.json())
            .then(data => setRoverData(data))
    }, [])

    return (
        <RoverContext.Provider value={{roverData: roverData}}>
            {props.children}
        </RoverContext.Provider>
    )
}

export {RoverContextProvider, RoverContext}
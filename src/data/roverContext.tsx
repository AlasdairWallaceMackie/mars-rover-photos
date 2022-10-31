import React from "react"

import {ContextInterface, RoverData} from "../d"

type Props = {
    children: React.ReactNode
}

const RoverContext = React.createContext<ContextInterface>({roverData: {rovers: []}})

function RoverContextProvider(props: Props){
    const [roverData, setRoverData] = React.useState<RoverData>({rovers: []})

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
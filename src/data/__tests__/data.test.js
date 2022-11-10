import React from "react"
import {render, screen, waitFor} from "@testing-library/react"

import RoverSelect from "../../components/RoverSelect"
import MOCK_API_DATA from "../mockApiData"


it('should read local mock API data', () => {
    expect(MOCK_API_DATA.rovers.length).toEqual(4)
})
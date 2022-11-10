import React from "react"
import {render, fireEvent, waitFor, screen} from  "@testing-library/react"
import Header from "../Header"


// HEADER
// ======
it('should display header title', () => {
    render(<Header />)
    const headerElement = screen.getByText("Welcome to Mars")
    expect(headerElement).toBeInTheDocument()
})
export interface ContextInterface {
    roverData: RoverData
}

export interface RoverData{
    rovers: Array<Rover>
}

export interface Rover{
    cameras: Array<CameraData>,
    id: number,
    landing_date: string,
    launch_date: string,
    max_date: string,
    max_sol: number,
    name: string,
    status: string,
    total_photos: number,
}

export interface ImageData {
    [key: string]: string,
    default: string
}

export interface CameraData{
    full_name: string,
    id: number,
    name: string,
    rover_id: number,
}

export interface Camera{
    disabled: boolean,
    selected: false,
    cameraObj: CameraData,
}

export interface Photo{
    camera: CameraData,
    earth_date: Date,
    id: number,
    img_src: string,
    rover: Rover,
    sol: number,
}


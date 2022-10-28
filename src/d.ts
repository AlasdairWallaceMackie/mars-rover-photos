export interface RoverData{
    rovers: Array<Rover>
}

export interface Rover{
    cameras: Array<CameraData>,
    id: number,
    landing_date: Date,
    launch_date: Date,
    max_date: Date,
    max_sol: number,
    name: string,
    status: string,
    total_photos: number,
}

export interface CameraData{
    full_name: string,
    id: number,
    name: string,
    rover_id: number,
}

export interface Camera{
    cameraObj: CameraData,
    disabled: boolean,
    selected: false,
}

export interface Photo{
    camera: CameraData,
    earth_date: Date,
    id: number,
    img_src: string,
    rover: Rover,
    sol: number,
}


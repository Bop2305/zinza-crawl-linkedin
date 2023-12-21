import React from "react"
import MainPaths from "../paths/mainPaths"
import { RouteObject } from "react-router-dom"

const Home = React.lazy(() => import("../../pages/Home"))
const About = React.lazy(() => import("../../pages/About"))

const mainRoutes: RouteObject[] = [
    { path: MainPaths.HOME, element: <Home /> },
    { path: MainPaths.ABOUT, element: <About /> }
]

export default mainRoutes
import {createBrowserRouter} from "react-router";
import BoardPage from "../features/boards/BoardPage";
import Home from "../pages/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "/boards",
        element: <BoardPage/>,
    },
]);

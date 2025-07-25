import {Link} from "react-router";

const Sidebar = () => {
    return (
        <aside className="w-64 h-screen bg-gray-100 border-r p-4">
            <nav className="flex flex-col space-y-4">
                <Link to="/">Home</Link>
                <Link to="/boards">Boards</Link>
            </nav>
        </aside>
    );
};

export default Sidebar;

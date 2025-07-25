import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Home = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar/>

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                <Header/>
                <main className="p-4">
                    <h1 className="text-2xl font-bold">Welcome to Taskify</h1>
                    <p className="mt-2 text-gray-600">
                        Manage your tasks efficiently and stay organized.
                    </p>
                </main>
            </div>
        </div>
    );
};

export default Home;

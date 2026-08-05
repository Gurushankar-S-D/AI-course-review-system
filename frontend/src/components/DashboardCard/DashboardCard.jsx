import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {

        localStorage.clear();

        navigate("/");

    };

    return (

        <>

            <Navbar
                username={user.username}
                onLogout={logout}
            />

            <div
                style={{
                    display:"flex"
                }}
            >

                <Sidebar />

                <div
                    style={{
                        padding:"30px"
                    }}
                >

                    <h1>Dashboard</h1>

                    <p>Welcome back {user.username}</p>

                </div>

            </div>

        </>

    );

}

export default Dashboard;
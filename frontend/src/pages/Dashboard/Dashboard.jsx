import { useNavigate } from "react-router-dom";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    return (
        <div style={{ padding: "40px" }}>
            <h1>Dashboard</h1>

            <h2>Welcome {user?.username}</h2>

            <p>Role: {user?.role}</p>

            <button
                onClick={() => navigate("/courses")}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer"
                }}
            >
                Courses
            </button>
        </div>
    );
}

export default Dashboard;
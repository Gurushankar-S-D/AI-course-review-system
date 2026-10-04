import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Courses from "./pages/Courses/Courses";
import SubmitReview from "./pages/SubmitReview/SubmitReview";
import BrowseReviews from "./pages/BrowseReviews/BrowseReviews";
import AIAnalysis from "./pages/AIAnalysis/AIAnalysis";
import Admin from "./pages/Admin/Admin";
import AdminRoute from "./components/AdminRoute.jsx";

function App() {
    return (
        <Routes>

            <Route path="/" element={<Login />} />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />

            <Route
                path="/courses"
                element={<Courses />}
            />

            <Route
                path="/submit-review"
                element={<SubmitReview />}
            />

            <Route
                path="/browse-reviews"
                element={<BrowseReviews />}
            />

            <Route
                path="/ai-analysis"
                element={<AIAnalysis />}
            />

            {/* ADMIN ONLY */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <Admin />
                    </AdminRoute>
                }
            />

        </Routes>
    );
}

export default App;
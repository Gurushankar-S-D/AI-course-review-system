import { useEffect, useState } from "react";
import { getAllCourses } from "../../services/courseService";
import { useNavigate } from "react-router-dom";

function Courses() {

    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await getAllCourses();
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h1>Courses</h1>

            {courses.map(course => (
                <div
                    key={course.courseId}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "15px",
                        marginBottom: "15px"
                    }}
                >
                    <h3>{course.courseName}</h3>

                    <button
                        onClick={() => navigate(`/review/${course.courseId}`)}
                    >
                        Review Course
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Courses;
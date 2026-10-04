import { useEffect, useState } from "react";
import { getCourseSummary } from "../../services/courseService";
import CourseCard from "../../components/CourseCard/CourseCard";
import Layout from "../../components/Layout/Layout";
import "./Courses.css";

function Courses() {

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await getCourseSummary();
            setCourses(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Layout>

            <div className="courses-page">

                <div className="page-header">

                    <h1>Available Courses</h1>

                    <p>
                        Browse all available courses along with their average ratings.
                    </p>

                </div>

                <div className="course-grid">

                    {courses.map(course => (

                        <CourseCard
                            key={course.courseId}
                            course={course}
                        />

                    ))}

                </div>

            </div>

        </Layout>
    );
}

export default Courses;
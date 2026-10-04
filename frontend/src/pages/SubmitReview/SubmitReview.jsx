import { useEffect, useState } from "react";
import { getAllCourses } from "../../services/courseService";
import { submitReview } from "../../services/reviewService";
import "./SubmitReview.css";
import Layout from "../../components/Layout/Layout";
import StarRating from "../../components/StarRating/StarRating";

function SubmitReview() {
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState("");
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await getAllCourses();
            setCourses(data);

            if (data.length > 0) {
                setCourseId(data[0].courseId);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        try {
            await submitReview({
                courseId,
                rating,
                review,
            });

            alert("Review submitted successfully!");

            setRating(5);
            setReview("");
        } catch (err) {
            console.error(err);
            alert("Failed to submit review");
        }
    };

    return (
        <Layout>
        <div className="submit-review-page">
            <div className="submit-review-card">
                <h1>Submit Review</h1>

                <label>Course</label>
                <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                >
                    {courses.map((course) => (
                        <option
                            key={course.courseId}
                            value={course.courseId}
                        >
                            {course.courseName}
                        </option>
                    ))}
                </select>

                <label>Rating</label>
                <StarRating
                    rating={rating}
                    setRating={setRating}
                />
                <label>Review</label>
                <textarea
                    rows="6"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review..."
                />

                <button onClick={handleSubmit}>
                    Submit Review
                </button>
            </div>
        </div>
            </Layout>
    );
}

export default SubmitReview;
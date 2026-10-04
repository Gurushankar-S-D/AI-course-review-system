import { useEffect, useState } from "react";
import { getAllReviews } from "../../services/reviewService";
import "./BrowseReviews.css";
import { getAllCourses } from "../../services/courseService";
import Layout from "../../components/Layout/Layout";

function BrowseReviews() {
    const [reviews, setReviews] = useState([]);
    const [courses, setCourses] = useState([]);
    const [courseFilter, setCourseFilter] = useState("");
    const [usernameFilter, setUsernameFilter] = useState("");
    const [reviewFilter, setReviewFilter] = useState("");
    const [sortBy, setSortBy] = useState("highest");

    useEffect(() => {
        loadReviews();
        loadCourses();
    }, []);

    const loadReviews = async () => {
        try {
            const data = await getAllReviews();
            console.log("Reviews:", data);
            setReviews(data);
        } catch (err) {
            console.error(err);
        }
    };
    const loadCourses = async () => {
        try {
            const data = await getAllCourses();
            setCourses(data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredReviews = reviews
        .filter(review =>
            courseFilter === "" ||
            review.courseName === courseFilter
        )
        .filter(review =>
            review.username
                .toLowerCase()
                .includes(usernameFilter.toLowerCase())
        )
        .filter(review =>
            review.review
                .toLowerCase()
                .includes(reviewFilter.toLowerCase())
        )
        .sort((a, b) => {

            if (sortBy === "highest")
                return b.rating - a.rating;

            if (sortBy === "lowest")
                return a.rating - b.rating;

            return 0;

        });
    return (
        <Layout>
        <div className="browse-page">
            <h1>Browse Reviews</h1>

            <div className="filter-section">

                <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                >
                    <option value="">All Courses</option>

                    {courses.map(course => (
                        <option
                            key={course.courseId}
                            value={course.courseName}
                        >
                            {course.courseName}
                        </option>
                    ))}

                </select>

                <input
                    type="text"
                    placeholder="Search by username..."
                    value={usernameFilter}
                    onChange={(e) => setUsernameFilter(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Search review..."
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>

            </div>

            {reviews.length === 0 ? (
                <div className="no-review">
                    No reviews found.
                </div>
            ) : (
                filteredReviews.map((review) => (
                    <div className="review-card" key={review.reviewId}>
                        <div className="review-header">
                            <div>
                                <div className="review-course">
                                    {review.courseName}
                                </div>
                                <div className="review-user">
                                    {review.username}
                                </div>
                            </div>

                            <div className="review-rating">
                                {"★".repeat(review.rating)}
                                {"☆".repeat(5 - review.rating)}
                            </div>
                        </div>

                        <div className="review-text">
                            {review.review}
                        </div>
                    </div>
                ))
            )}
        </div>
        </Layout>
    );
}

export default BrowseReviews;
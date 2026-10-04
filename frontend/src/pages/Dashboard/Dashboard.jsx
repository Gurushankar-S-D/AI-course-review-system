import Layout from "../../components/Layout/Layout";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import {
    getDashboard,
    getRecentReviews
} from "../../services/dashboardService";

import {
    BookOpen,
    Bot,
    FileText,
    Star,
    MessageSquare,
    BarChart3
} from "lucide-react";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [recentReviews, setRecentReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
        loadRecentReviews();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await getDashboard();
            setDashboard(data);
        } catch (error) {
            console.error("Dashboard loading error:", error);
        }
    };

    const loadRecentReviews = async () => {
        try {
            const data = await getRecentReviews();

            if (Array.isArray(data)) {
                setRecentReviews(data);
            } else {
                setRecentReviews([]);
            }

        } catch (error) {
            console.error("Recent reviews loading error:", error);
            setRecentReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const getInitial = (username) => {
        if (!username) return "?";

        return username
            .trim()
            .charAt(0)
            .toUpperCase();
    };

    const getRatingStars = (rating) => {
        const value = Number(rating) || 0;

        return (
            <span className="review-rating" aria-label={`${value} out of 5 stars`}>
                {"⭐".repeat(Math.max(0, Math.min(5, value)))}
            </span>
        );
    };

    const courseRatings = dashboard?.courseRatings ?? [];
    const topRatedCourses = dashboard?.topRatedCourses ?? [];
    const ratingDistribution = dashboard?.ratingDistribution ?? [];
    const largestDistributionCount = Math.max(
        ...ratingDistribution.map((item) => Number(item.count) || 0),
        1
    );

    const getRatingLabel = (rating) => {
        if (rating >= 4.5) return "Excellent";
        if (rating >= 4) return "Very Good";
        if (rating >= 3) return "Good";
        if (rating >= 2) return "Needs improvement";
        return "Needs more feedback";
    };

    return (
        <Layout>

            <div className="dashboard-page">

                {/* ================= HEADER ================= */}

                <section className="dashboard-header">

                    <div className="dashboard-title">

                        <div className="dashboard-title-icon">
                            <BarChart3 size={24} />
                        </div>

                        <div>
                            <h1>Analytics Dashboard</h1>

                            <p>
                                Visual insights from student feedback
                            </p>
                        </div>

                    </div>

                </section>


                {/* ================= OVERVIEW ================= */}

                <section className="overview-section">

                    <div className="section-header">

                        <div>
                            <h2>Overview</h2>

                            <p>
                                Real-time statistics from course reviews
                            </p>
                        </div>

                        <span className="section-badge">
                            Live Statistics
                        </span>

                    </div>


                    <div className="stats-grid">

                        {/* Total Reviews */}

                        <div className="stat-card">

                            <div className="stat-icon">
                                <FileText size={24} />
                            </div>

                            <div className="stat-info">

                                <p>Total Reviews</p>

                                <h2>
                                    {dashboard?.totalReviews ?? 0}
                                </h2>

                                <span>
                                    Student Feedback
                                </span>

                            </div>

                        </div>


                        {/* Average Rating */}

                        <div className="stat-card">

                            <div className="stat-icon">
                                <Star size={24} />
                            </div>

                            <div className="stat-info">

                                <p>Average Rating</p>

                                <h2>
                                    {dashboard?.averageRating != null
                                        ? Number(dashboard.averageRating).toFixed(1)
                                        : "0.0"}
                                </h2>

                                <span>
                                    Across all courses
                                </span>

                            </div>

                        </div>


                        {/* Courses */}

                        <div className="stat-card">

                            <div className="stat-icon">
                                <BookOpen size={24} />
                            </div>

                            <div className="stat-info">

                                <p>Total Courses</p>

                                <h2>
                                    {dashboard?.totalCourses ?? 0}
                                </h2>

                                <span>
                                    Available courses
                                </span>

                            </div>

                        </div>


                        {/* AI Analysis */}

                        <div className="stat-card">

                            <div className="stat-icon">
                                <Bot size={24} />
                            </div>

                            <div className="stat-info">

                                <p>AI Analysis</p>

                                <h2>
                                    {dashboard?.aiAnalysedReviews ?? 0}
                                </h2>

                                <span>
                                    Reviews analyzed
                                </span>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= ANALYTICS ================= */}

                <section className="analytics-section">

                    <div className="section-header">

                        <div>

                            <h2>Analytics</h2>

                            <p>
                                Course performance and rating distribution
                            </p>

                        </div>

                    </div>


                    <div className="analytics-grid">

                        {/* Average Rating */}

                        <div className="chart-card">

                            <div className="chart-header">

                                <div className="chart-title-icon">
                                    <BarChart3 size={20} />
                                </div>

                                <div>
                                    <h3>
                                        Average Rating Per Course
                                    </h3>

                                    <p>
                                        Course-wise performance
                                    </p>
                                </div>

                            </div>

                            <div className="chart-body">
                                {courseRatings.length === 0 ? (
                                    <div className="chart-placeholder">
                                        <BarChart3 size={42} />
                                        <strong>No course ratings yet</strong>
                                        <span>Ratings will appear after students submit reviews.</span>
                                    </div>
                                ) : (
                                    <div className="rating-bar-chart">
                                        {courseRatings.map((course) => (
                                            <div className="rating-bar-row" key={course.courseId}>
                                                <span className="rating-bar-label" title={course.courseName}>
                                                    {course.courseName}
                                                </span>
                                                <div className="rating-bar-track">
                                                    <div
                                                        className="rating-bar-fill"
                                                        style={{ width: `${(Number(course.averageRating) / 5) * 100}%` }}
                                                    />
                                                </div>
                                                <strong>{Number(course.averageRating).toFixed(1)}</strong>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>

                        </div>


                        {/* Rating Distribution */}

                        <div className="chart-card">

                            <div className="chart-header">

                                <div className="chart-title-icon">
                                    <Star size={20} />
                                </div>

                                <div>
                                    <h3>
                                        Rating Distribution
                                    </h3>

                                    <p>
                                        Student rating breakdown
                                    </p>
                                </div>

                            </div>

                            <div className="chart-body">
                                {dashboard?.totalReviews === 0 ? (
                                    <div className="chart-placeholder">
                                        <Star size={42} />
                                        <strong>No ratings yet</strong>
                                        <span>Rating distribution will appear after reviews are submitted.</span>
                                    </div>
                                ) : (
                                    <div className="distribution-chart">
                                        {ratingDistribution.map((item) => (
                                            <div className="distribution-row" key={item.rating}>
                                                <span>{item.rating} ★</span>
                                                <div className="distribution-track">
                                                    <div
                                                        className="distribution-fill"
                                                        style={{
                                                            width: `${((Number(item.count) || 0) / largestDistributionCount) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                                <strong>{item.count}</strong>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= RECENT REVIEWS ================= */}

                <section className="recent-reviews-section">

                    <div className="section-header">

                        <div>

                            <h2>Recent Reviews</h2>

                            <p>
                                Latest feedback submitted by students
                            </p>

                        </div>

                        <div className="section-count">
                            <MessageSquare size={16} />
                            {recentReviews.length} reviews
                        </div>

                    </div>


                    {loading ? (

                        <div className="dashboard-empty-state">

                            <div className="loading-spinner"></div>

                            <p>
                                Loading recent reviews...
                            </p>

                        </div>

                    ) : recentReviews.length === 0 ? (

                        <div className="dashboard-empty-state">

                            <MessageSquare size={38} />

                            <h3>
                                No reviews yet
                            </h3>

                            <p>
                                Student reviews will appear here once submitted.
                            </p>

                        </div>

                    ) : (

                        <div className="reviews-list">

                            {recentReviews.map((review, index) => (

                                <div
                                    className="review-card"
                                    key={
                                        review.reviewId ??
                                        review.id ??
                                        `${review.username ?? "review"}-${index}`
                                    }
                                >

                                    <div className="review-header">

                                        <div className="review-user">

                                            <div className="review-avatar">
                                                {getInitial(review.username)}
                                            </div>

                                            <div className="review-user-info">

                                                <h4>
                                                    {review.username || "Anonymous"}
                                                </h4>

                                                <p>
                                                    {review.courseName || "Course"}
                                                </p>

                                            </div>

                                        </div>


                                        <div className="review-rating-wrapper">

                                            {getRatingStars(review.rating)}

                                            <span className="rating-number">
                                                {Number(review.rating) || 0}/5
                                            </span>

                                        </div>

                                    </div>


                                    <p className="review-text">

                                        {review.reviewText ||
                                            review.review ||
                                            "No review text available."}

                                    </p>


                                    {review.createdAt && (

                                        <div className="review-date">

                                            {new Date(
                                                review.createdAt
                                            ).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })}

                                        </div>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* ================= TOP COURSES ================= */}

                <section className="top-courses-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Top Rated Courses
                            </h2>

                            <p>
                                Course performance based on student feedback
                            </p>

                        </div>

                    </div>


                    <div className="courses-grid">
                        {topRatedCourses.length === 0 ? (
                            <div className="dashboard-empty-state">
                                <BookOpen size={38} />
                                <h3>No course ratings yet</h3>
                                <p>Top-rated courses will appear once students submit reviews.</p>
                            </div>
                        ) : (
                            topRatedCourses.map((course, index) => (
                                <div className="course-card" key={course.courseId}>
                                    <div className="course-rank">#{index + 1}</div>
                                    <div className="course-card-header">
                                        <div>
                                            <h3>{course.courseName}</h3>
                                            <p>{course.description || "Course feedback"}</p>
                                        </div>
                                        <span className="course-rating">
                                            ⭐ {Number(course.averageRating).toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="course-meta">
                                        <span>{course.reviewCount} {course.reviewCount === 1 ? "Review" : "Reviews"}</span>
                                        <span>{getRatingLabel(Number(course.averageRating))}</span>
                                    </div>
                                    <div className="progress">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${(Number(course.averageRating) / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}

                    </div>

                </section>

            </div>

        </Layout>
    );
}

export default Dashboard;

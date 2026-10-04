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

                                <div className="chart-placeholder">

                                    <BarChart3 size={42} />

                                    <strong>
                                        Course Rating Analytics
                                    </strong>

                                    <span>
                                        Your existing bar chart can be displayed here.
                                    </span>

                                </div>

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

                                <div className="chart-placeholder">

                                    <Star size={42} />

                                    <strong>
                                        Rating Distribution
                                    </strong>

                                    <span>
                                        Your existing doughnut chart can be displayed here.
                                    </span>

                                </div>

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

                        {/* Java */}

                        <div className="course-card">

                            <div className="course-rank">
                                #1
                            </div>

                            <div className="course-card-header">

                                <div>

                                    <h3>
                                        Java Programming
                                    </h3>

                                    <p>
                                        Core programming
                                    </p>

                                </div>

                                <span className="course-rating">
                                    ⭐ 4.9
                                </span>

                            </div>


                            <div className="course-meta">

                                <span>
                                    248 Reviews
                                </span>

                                <span>
                                    Excellent
                                </span>

                            </div>


                            <div className="progress">

                                <div
                                    className="progress-fill"
                                    style={{ width: "98%" }}
                                ></div>

                            </div>


                            <button
                                className="course-btn"
                                type="button"
                            >
                                View Details →
                            </button>

                        </div>


                        {/* Python */}

                        <div className="course-card">

                            <div className="course-rank">
                                #2
                            </div>

                            <div className="course-card-header">

                                <div>

                                    <h3>
                                        Python
                                    </h3>

                                    <p>
                                        Programming & development
                                    </p>

                                </div>

                                <span className="course-rating">
                                    ⭐ 4.8
                                </span>

                            </div>


                            <div className="course-meta">

                                <span>
                                    215 Reviews
                                </span>

                                <span>
                                    Excellent
                                </span>

                            </div>


                            <div className="progress">

                                <div
                                    className="progress-fill"
                                    style={{ width: "92%" }}
                                ></div>

                            </div>


                            <button
                                className="course-btn"
                                type="button"
                            >
                                View Details →
                            </button>

                        </div>


                        {/* Web Development */}

                        <div className="course-card">

                            <div className="course-rank">
                                #3
                            </div>

                            <div className="course-card-header">

                                <div>

                                    <h3>
                                        Web Development
                                    </h3>

                                    <p>
                                        Frontend & backend
                                    </p>

                                </div>

                                <span className="course-rating">
                                    ⭐ 4.7
                                </span>

                            </div>


                            <div className="course-meta">

                                <span>
                                    198 Reviews
                                </span>

                                <span>
                                    Very Good
                                </span>

                            </div>


                            <div className="progress">

                                <div
                                    className="progress-fill"
                                    style={{ width: "89%" }}
                                ></div>

                            </div>


                            <button
                                className="course-btn"
                                type="button"
                            >
                                View Details →
                            </button>

                        </div>

                    </div>

                </section>

            </div>

        </Layout>
    );
}

export default Dashboard;
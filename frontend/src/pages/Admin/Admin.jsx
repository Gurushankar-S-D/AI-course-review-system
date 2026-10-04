import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout/Layout";
import "./Admin.css";

import {
    getAllCourses,
    getCourseSummary,
    addCourse,
    updateCourse,
    deleteCourse
} from "../../services/courseService";

import {
    getAllReviews,
    deleteReview
} from "../../services/reviewService";

import {
    getAnalysesForReviews
} from "../../services/analysisService";

import {
    getAllUsers,
    deleteUser
} from "../../services/userService";

function Admin() {

    // =========================
    // STATE
    // =========================

    const [courses, setCourses] = useState([]);
    const [courseSummary, setCourseSummary] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [courseName, setCourseName] = useState("");
    const [courseDescription, setCourseDescription] = useState("");

    const [editingCourse, setEditingCourse] = useState(null);

    const [search, setSearch] = useState("");
    const [courseFilter, setCourseFilter] = useState("ALL");
    const [ratingFilter, setRatingFilter] = useState("ALL");
    const [sentimentFilter, setSentimentFilter] = useState("ALL");

    const [selectedCourseId, setSelectedCourseId] = useState("");

    const [aiAnalyses, setAiAnalyses] = useState([]);
    const [overallAiAnalyses, setOverallAiAnalyses] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState("");
    const [userLoading, setUserLoading] = useState(false);

    // =========================
    // LOAD DATA
    // =========================

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                coursesData,
                summaryData,
                reviewsData
            ] = await Promise.all([
                getAllCourses(),
                getCourseSummary(),
                getAllReviews()
            ]);

            const safeCourses =
                Array.isArray(coursesData)
                    ? coursesData
                    : [];

            const safeSummary =
                Array.isArray(summaryData)
                    ? summaryData
                    : [];

            const safeReviews =
                Array.isArray(reviewsData)
                    ? reviewsData
                    : [];

            setCourses(safeCourses);
            setCourseSummary(safeSummary);
            setReviews(safeReviews);

            // Load AI analysis for ALL reviews
            const overallAnalyses =
                await getAnalysesForReviews(safeReviews);

            setOverallAiAnalyses(
                Array.isArray(overallAnalyses)
                    ? overallAnalyses
                    : []
            );

        } catch (err) {

            console.error("Admin data loading error:", err);

            setError(
                err?.response?.data?.message ||
                "Failed to load admin data."
            );

        } finally {

            setLoading(false);

        }
    };
    const overallAiStats = useMemo(() => {

        if (!overallAiAnalyses.length) {
            return {
                analysedCourses: 0,
                positivePercentage: 0
            };
        }

        const reviewMap = new Map(
            reviews.map((review) => [
                String(review.reviewId),
                review
            ])
        );

        const analysedCourseNames = new Set();

        let positiveCount = 0;

        overallAiAnalyses.forEach((analysis) => {

            const review = reviewMap.get(
                String(analysis?.reviewId)
            );

            if (review?.courseName) {
                analysedCourseNames.add(
                    String(review.courseName)
                );
            }

            const sentiment =
                String(
                    analysis?.sentiment || ""
                ).toLowerCase();

            if (sentiment.includes("positive")) {
                positiveCount++;
            }
        });

        const totalAnalyses =
            overallAiAnalyses.length;

        return {
            analysedCourses:
            analysedCourseNames.size,

            positivePercentage:
                Math.round(
                    (positiveCount / totalAnalyses) * 100
                )
        };

    }, [overallAiAnalyses, reviews]);

    const loadUsers = async () => {
        try {
            setUserLoading(true);

            const usersData = await getAllUsers();

            setUsers(
                Array.isArray(usersData)
                    ? usersData
                    : []
            );

        } catch (err) {
            console.error("User loading error:", err);

            setError(
                err?.response?.data?.message ||
                "Failed to load users."
            );

        } finally {
            setUserLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        loadUsers();
    }, []);

    // =========================
// USER MANAGEMENT
// =========================

    const handleDeleteUser = async (user) => {
        if (!user?.userId) {
            setError("Invalid user ID.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete user "${user.username}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setUserLoading(true);
            setError("");
            setMessage("");

            await deleteUser(user.userId);

            setMessage(
                `User "${user.username}" deleted successfully.`
            );

            await loadUsers();

        } catch (err) {
            console.error("DELETE USER ERROR:", err);

            if (err?.response?.status === 401) {
                setError(
                    "Your login session has expired. Please login again."
                );
            } else if (err?.response?.status === 403) {
                setError(
                    "You are not authorized to delete users."
                );
            } else {
                setError(
                    err?.response?.data?.message ||
                    "Failed to delete user."
                );
            }

        } finally {
            setUserLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        const text = userSearch.toLowerCase().trim();

        if (!text) {
            return users;
        }

        return users.filter((user) =>
            String(user.username || "")
                .toLowerCase()
                .includes(text) ||
            String(user.email || "")
                .toLowerCase()
                .includes(text) ||
            String(user.role || "")
                .toLowerCase()
                .includes(text)
        );
    }, [users, userSearch]);

    // =========================
    // COURSE MANAGEMENT
    // =========================

    const handleAddCourse = async () => {

        const name = courseName.trim();
        const description = courseDescription.trim();

        if (!name) {
            setError("Course name is required.");
            setMessage("");
            return;
        }

        if (!description) {
            setError("Course description is required.");
            setMessage("");
            return;
        }

        try {

            setSaving(true);
            setError("");
            setMessage("");

            await addCourse(name, description);

            setCourseName("");
            setCourseDescription("");

            setMessage("Course added successfully.");

            await loadData();

        } catch (err) {

            console.error("ADD COURSE ERROR:", err);

            console.error(
                "Status:",
                err?.response?.status
            );

            console.error(
                "Backend response:",
                err?.response?.data
            );

            if (err?.response?.status === 400) {

                setError(
                    err?.response?.data?.message ||
                    "Invalid course data. Course name and description are required."
                );

            } else if (err?.response?.status === 401) {

                setError(
                    "Your login session has expired. Please login again."
                );

            } else if (err?.response?.status === 403) {

                setError(
                    "You are not authorized to add courses."
                );

            } else {

                setError(
                    err?.response?.data?.message ||
                    "Failed to add course."
                );
            }

        } finally {

            setSaving(false);
        }
    };


    const handleEditCourse = async (course) => {

        const newName = window.prompt(
            "Enter the new course name:",
            course.courseName || ""
        );

        if (newName === null) {
            return;
        }

        const trimmedName = newName.trim();

        if (!trimmedName) {
            setError("Course name cannot be empty.");
            return;
        }

        const newDescription = window.prompt(
            "Enter the course description:",
            course.description || ""
        );

        if (newDescription === null) {
            return;
        }

        try {

            setSaving(true);
            setError("");
            setMessage("");

            await updateCourse(course.courseId, {
                courseName: trimmedName,
                description: newDescription.trim()
            });

            setMessage("Course updated successfully.");

            await loadData();

        } catch (err) {

            console.error("Update course error:", err);

            setError(
                err?.response?.data?.message ||
                "Failed to update course."
            );

        } finally {

            setSaving(false);
        }
    };


    const handleDeleteCourse = async (course) => {

        if (!course?.courseId) {
            setError("Invalid course ID.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${course.courseName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setSaving(true);
            setError("");
            setMessage("");

            console.log(
                "Deleting course ID:",
                course.courseId
            );

            await deleteCourse(course.courseId);

            setMessage(
                `"${course.courseName}" deleted successfully.`
            );

            if (
                String(selectedCourseId) ===
                String(course.courseId)
            ) {
                setSelectedCourseId("");
                setAiAnalyses([]);
            }

            await loadData();

        } catch (err) {

            console.error("DELETE COURSE ERROR:", err);

            console.error(
                "Status:",
                err?.response?.status
            );

            console.error(
                "Backend response:",
                err?.response?.data
            );

            if (err?.response?.status === 401) {

                setError(
                    "Your login session has expired. Please login again."
                );

            } else if (err?.response?.status === 403) {

                setError(
                    "You are not authorized to delete courses."
                );

            } else if (err?.response?.status === 409) {

                setError(
                    "This course cannot be deleted because it is being used by existing reviews."
                );

            } else {

                setError(
                    err?.response?.data?.message ||
                    "Failed to delete course."
                );
            }

        } finally {

            setSaving(false);
        }
    };


    // =========================
    // REVIEW MANAGEMENT
    // =========================

    const handleDeleteReview = async (review) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setSaving(true);
            setError("");
            setMessage("");

            await deleteReview(review.reviewId);

            setMessage("Review deleted successfully.");

            await loadData();

        } catch (err) {

            console.error("Delete review error:", err);

            setError(
                err?.response?.data?.message ||
                "Failed to delete review."
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================
    // FILTER REVIEWS
    // =========================

    const filteredReviews = useMemo(() => {

        return reviews.filter((review) => {

            const text = search.toLowerCase().trim();

            const matchesSearch =
                !text ||
                String(review.username || "")
                    .toLowerCase()
                    .includes(text) ||
                String(review.courseName || "")
                    .toLowerCase()
                    .includes(text) ||
                String(review.review || "")
                    .toLowerCase()
                    .includes(text);

            const matchesCourse =
                courseFilter === "ALL" ||
                String(review.courseName) ===
                String(courseFilter);

            const rating = Number(review.rating || 0);

            let matchesRating = true;

            if (ratingFilter !== "ALL") {
                matchesRating =
                    rating >= Number(ratingFilter);
            }

            const reviewSentiment =
                String(
                    review.sentiment ||
                    review.analysis?.sentiment ||
                    ""
                ).toLowerCase();

            let matchesSentiment = true;

            if (sentimentFilter !== "ALL") {
                matchesSentiment =
                    reviewSentiment ===
                    sentimentFilter.toLowerCase();
            }

            return (
                matchesSearch &&
                matchesCourse &&
                matchesRating &&
                matchesSentiment
            );
        });

    }, [
        reviews,
        search,
        courseFilter,
        ratingFilter,
        sentimentFilter
    ]);


    // =========================
    // AI ANALYSIS
    // =========================

    const selectedCourseReviews = useMemo(() => {

        if (!selectedCourseId) {
            return [];
        }

        const selectedCourse = courses.find(
            (course) =>
                String(course.courseId) ===
                String(selectedCourseId)
        );

        if (!selectedCourse) {
            return [];
        }

        return reviews.filter(
            (review) =>
                String(review.courseName) ===
                String(selectedCourse.courseName)
        );

    }, [
        selectedCourseId,
        courses,
        reviews
    ]);


    const handleGenerateAIAnalysis = async () => {

        if (!selectedCourseId) {
            setError("Please select a course first.");
            return;
        }

        if (selectedCourseReviews.length === 0) {
            setError("No reviews are available for this course.");
            return;
        }

        try {

            setAiLoading(true);
            setError("");
            setMessage("");

            const analyses =
                await getAnalysesForReviews(
                    selectedCourseReviews
                );

            setAiAnalyses(analyses);

            const refreshedOverallAnalyses =
                await getAnalysesForReviews(reviews);

            setOverallAiAnalyses(
                Array.isArray(refreshedOverallAnalyses)
                    ? refreshedOverallAnalyses
                    : []
            );

            if (analyses.length === 0) {

                setMessage(
                    "No saved AI analysis is available for the selected reviews."
                );

            } else {

                setMessage(
                    `${analyses.length} AI analysis result(s) loaded.`
                );
            }

        } catch (err) {

            console.error(
                "AI analysis loading error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load AI analysis."
            );

        } finally {

            setAiLoading(false);
        }
    };


    // =========================
    // AI CALCULATIONS
    // =========================

    const aiStats = useMemo(() => {

        if (!aiAnalyses.length) {
            return {
                positive: 0,
                neutral: 0,
                negative: 0
            };
        }

        let positive = 0;
        let neutral = 0;
        let negative = 0;

        aiAnalyses.forEach((analysis) => {

            const sentiment =
                String(
                    analysis?.sentiment || ""
                ).toLowerCase();

            if (sentiment.includes("positive")) {
                positive++;
            } else if (sentiment.includes("negative")) {
                negative++;
            } else {
                neutral++;
            }
        });

        const total = aiAnalyses.length;

        return {
            positive: Math.round(
                (positive / total) * 100
            ),
            neutral: Math.round(
                (neutral / total) * 100
            ),
            negative: Math.round(
                (negative / total) * 100
            )
        };

    }, [aiAnalyses]);


    const aiKeywords = useMemo(() => {

        const keywords = [];

        aiAnalyses.forEach((analysis) => {

            if (!analysis?.keywords) {
                return;
            }

            if (Array.isArray(analysis.keywords)) {

                analysis.keywords.forEach((keyword) => {
                    keywords.push(String(keyword).trim());
                });

            } else {

                String(analysis.keywords)
                    .split(",")
                    .forEach((keyword) => {
                        if (keyword.trim()) {
                            keywords.push(
                                keyword.trim()
                            );
                        }
                    });
            }
        });

        return [
            ...new Set(
                keywords.filter(Boolean)
            )
        ];

    }, [aiAnalyses]);


    const selectedCourseSummary = useMemo(() => {

        return courseSummary.find(
            (course) =>
                String(course.courseId) ===
                String(selectedCourseId)
        );

    }, [courseSummary, selectedCourseId]);


    // =========================
    // RENDER
    // =========================

    return (
        <Layout>

            <div className="admin-container">

                <div className="admin-title">
                    <h1>Admin Control Panel</h1>
                    <p>
                        Manage Courses • Reviews • AI Insights
                    </p>
                </div>


                {error && (
                    <div className="admin-message error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="admin-message success">
                        {message}
                    </div>
                )}


                {/* =========================
                    DASHBOARD
                ========================= */}

                <section className="admin-section">

                    <h2>📊 Dashboard</h2>

                    <div className="dashboard-grid">

                        <div className="admin-dashboard-card">
                            <h3>Total Courses</h3>
                            <span>
                                {courses.length}
                            </span>
                        </div>

                        <div className="admin-dashboard-card">
                            <h3>Total Reviews</h3>
                            <span>
                                {reviews.length}
                            </span>
                        </div>

                        <div className="admin-dashboard-card">
                            <h3>Average Rating</h3>
                            <span>
                                ⭐{" "}
                                {reviews.length
                                    ? (
                                        reviews.reduce(
                                            (sum, review) =>
                                                sum +
                                                Number(
                                                    review.rating || 0
                                                ),
                                            0
                                        ) / reviews.length
                                    ).toFixed(1)
                                    : "0.0"}
                            </span>
                        </div>

                        <div className="admin-dashboard-card">
                            <h3>AI Analysed</h3>
                            <span>
                                 {overallAiStats.analysedCourses}
                            </span>
                        </div>

                        <div className="admin-dashboard-card">
                            <h3>Top Rated Course</h3>
                            <span>
                                {courseSummary.length
                                    ? courseSummary.reduce(
                                    (best, course) =>
                                        Number(
                                            course.averageRating || 0
                                        ) >
                                        Number(
                                            best.averageRating || 0
                                        )
                                            ? course
                                            : best,
                                    courseSummary[0]
                                )?.courseName || "—"
                                    : "—"}
                            </span>
                        </div>

                        <div className="admin-dashboard-card">
                            <h3>Positive AI Reviews</h3>
                            <span>
        {overallAiAnalyses.length
            ? `${overallAiStats.positivePercentage}%`
            : "—"}
    </span>
                        </div>

                    </div>

                </section>


                {/* =========================
                    COURSE MANAGEMENT
                ========================= */}

                <section className="admin-section">

                    <h2>📚 Course Management</h2>

                    <div className="course-management">

                        <div className="add-course-card">

                            <h3>
                                {editingCourse
                                    ? "Edit Course"
                                    : "Add New Course"}
                            </h3>

                            <div className="add-course-form">

                                <input
                                    type="text"
                                    placeholder="Enter Course Name"
                                    value={courseName}
                                    onChange={(e) =>
                                        setCourseName(e.target.value)
                                    }
                                />

                                <input
                                    type="text"
                                    placeholder="Enter Course Description"
                                    value={courseDescription}
                                    onChange={(e) =>
                                        setCourseDescription(e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={handleAddCourse}
                                    disabled={saving}
                                >
                                    {saving ? "Adding..." : "+ Add Course"}
                                </button>

                            </div>

                        </div>


                        <div className="course-table-card">

                            <h3>Existing Courses</h3>

                            {loading ? (
                                <p>Loading courses...</p>
                            ) : (
                                <table>

                                    <thead>
                                    <tr>
                                        <th>Course</th>
                                        <th>Reviews</th>
                                        <th>Rating</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>

                                    <tbody>

                                    {courseSummary.map(
                                        (course) => {

                                            const reviewCount =
                                                Number(
                                                    course.totalReviews || 0
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        course.courseId
                                                    }
                                                >

                                                    <td>
                                                        <strong>
                                                            {
                                                                course.courseName
                                                            }
                                                        </strong>

                                                        {course.description && (
                                                            <small
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    marginTop:
                                                                        "4px"
                                                                }}
                                                            >
                                                                {
                                                                    course.description
                                                                }
                                                            </small>
                                                        )}
                                                    </td>

                                                    <td>
                                                        {
                                                            reviewCount
                                                        }
                                                    </td>

                                                    <td>
                                                        ⭐{" "}
                                                        {Number(
                                                            course.averageRating ||
                                                            0
                                                        ).toFixed(1)}
                                                    </td>

                                                    <td>

                                                        <button
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                handleEditCourse(
                                                                    course
                                                                )
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDeleteCourse(
                                                                    course
                                                                )
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                    </tbody>

                                </table>
                            )}

                        </div>

                    </div>

                </section>


                {/* =========================
                    REVIEW MANAGEMENT
                ========================= */}

                <section className="admin-section">

                    <h2>⭐ Review Management</h2>

                    <div className="review-toolbar">

                        <input
                            type="text"
                            placeholder="Search reviews..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        <select
                            value={courseFilter}
                            onChange={(e) =>
                                setCourseFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="ALL">
                                All Courses
                            </option>

                            {courses.map((course) => (
                                <option
                                    key={course.courseId}
                                    value={course.courseName}
                                >
                                    {course.courseName}
                                </option>
                            ))}

                        </select>

                        <select
                            value={ratingFilter}
                            onChange={(e) =>
                                setRatingFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="ALL">
                                All Ratings
                            </option>
                            <option value="5">
                                5 ⭐
                            </option>
                            <option value="4">
                                4 ⭐ & Above
                            </option>
                            <option value="3">
                                3 ⭐ & Above
                            </option>
                            <option value="2">
                                2 ⭐ & Above
                            </option>
                            <option value="1">
                                1 ⭐ & Above
                            </option>
                        </select>

                        <select
                            value={sentimentFilter}
                            onChange={(e) =>
                                setSentimentFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="ALL">
                                All Sentiments
                            </option>
                            <option value="Positive">
                                Positive
                            </option>
                            <option value="Neutral">
                                Neutral
                            </option>
                            <option value="Negative">
                                Negative
                            </option>
                        </select>

                    </div>


                    <div className="review-grid">

                        {filteredReviews.length === 0 ? (

                            <p>
                                No reviews found.
                            </p>

                        ) : (

                            filteredReviews.map(
                                (review) => {

                                    const rating =
                                        Number(
                                            review.rating || 0
                                        );

                                    const sentiment =
                                        review.sentiment ||
                                        review.analysis?.sentiment ||
                                        "";

                                    return (
                                        <div
                                            className="review-card"
                                            key={
                                                review.reviewId
                                            }
                                        >

                                            <div className="review-top">

                                                <h3>
                                                    {
                                                        review.courseName
                                                    }
                                                </h3>

                                                <span>
                                                    {"⭐".repeat(
                                                        rating
                                                    )}
                                                </span>

                                            </div>

                                            <p className="review-user">
                                                By{" "}
                                                {
                                                    review.username
                                                }
                                            </p>

                                            <p className="review-text">
                                                {
                                                    review.review
                                                }
                                            </p>

                                            {sentiment && (
                                                <div
                                                    className={`sentiment ${String(
                                                        sentiment
                                                    ).toLowerCase()}`}
                                                >
                                                    {sentiment}
                                                </div>
                                            )}

                                            <div className="review-actions">

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDeleteReview(
                                                            review
                                                        )
                                                    }
                                                    disabled={
                                                        saving
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>
                                    );
                                }
                            )

                        )}

                    </div>

                </section>


                {/* =========================
                    USER MANAGEMENT
                ========================= */}

                <section className="admin-section">

                    <h2>👥 User Management</h2>

                    <div className="user-management">

                        <div className="user-toolbar">

                            <input
                                type="text"
                                placeholder="Search users by username, email or role..."
                                value={userSearch}
                                onChange={(e) =>
                                    setUserSearch(e.target.value)
                                }
                            />

                            <span className="user-count">
                                {filteredUsers.length} user
                                {filteredUsers.length !== 1 ? "s" : ""}
                            </span>

                        </div>

                        <div className="user-table-card">

                            {userLoading ? (

                                <p>Loading users...</p>

                            ) : filteredUsers.length === 0 ? (

                                <div className="empty-users">
                                    <div className="empty-users-icon">
                                        👤
                                    </div>

                                    <h3>No users found</h3>

                                    <p>
                                        Try changing your search
                                        or add a new user.
                                    </p>
                                </div>

                            ) : (

                                <div className="table-wrapper">

                                    <table>

                                        <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody>

                                        {filteredUsers.map((user) => (

                                            <tr key={user.userId}>

                                                <td>
                                                    <strong>
                                                        {user.username}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {user.email || "—"}
                                                </td>

                                                <td>
                                                        <span
                                                            className={`user-role ${
                                                                String(
                                                                    user.role || ""
                                                                ).toLowerCase()
                                                            }`}
                                                        >
                                                            {user.role || "USER"}
                                                        </span>
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleDeleteUser(user)
                                                        }
                                                        disabled={userLoading}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>

                                            </tr>

                                        ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>

                </section>


                {/* =========================
                    AI INSIGHTS
                ========================= */}

                <section className="admin-section">

                    <h2>🤖 AI Insights</h2>

                    <div className="ai-top-bar">

                        <select
                            value={selectedCourseId}
                            onChange={(e) => {
                                setSelectedCourseId(
                                    e.target.value
                                );
                                setAiAnalyses([]);
                                setMessage("");
                                setError("");
                            }}
                        >

                            <option value="">
                                Select Course
                            </option>

                            {courses.map((course) => (
                                <option
                                    key={course.courseId}
                                    value={course.courseId}
                                >
                                    {course.courseName}
                                </option>
                            ))}

                        </select>


                        <button
                            className="generate-btn"
                            onClick={
                                handleGenerateAIAnalysis
                            }
                            disabled={aiLoading}
                        >
                            {aiLoading
                                ? "Loading AI Analysis..."
                                : "Generate AI Analysis"}
                        </button>

                    </div>


                    <div className="ai-dashboard">

                        <div className="admin-ai-card">
                            <h3>Overall Sentiment</h3>
                            <span>
                                {aiAnalyses.length
                                    ? aiStats.positive >=
                                    aiStats.negative
                                        ? "😊 Positive"
                                        : "😞 Negative"
                                    : "—"}
                            </span>
                        </div>

                        <div className="admin-ai-card">
                            <h3>Positive</h3>
                            <span>
                                {aiAnalyses.length
                                    ? `${aiStats.positive}%`
                                    : "—"}
                            </span>
                        </div>

                        <div className="admin-ai-card">
                            <h3>Neutral</h3>
                            <span>
                                {aiAnalyses.length
                                    ? `${aiStats.neutral}%`
                                    : "—"}
                            </span>
                        </div>

                        <div className="admin-ai-card">
                            <h3>Negative</h3>
                            <span>
                                {aiAnalyses.length
                                    ? `${aiStats.negative}%`
                                    : "—"}
                            </span>
                        </div>

                        <div className="admin-ai-card">
                            <h3>Average Rating</h3>
                            <span>
                                {selectedCourseSummary
                                    ? `⭐ ${Number(
                                        selectedCourseSummary.averageRating ||
                                        0
                                    ).toFixed(1)}`
                                    : "—"}
                            </span>
                        </div>

                        <div className="admin-ai-card">
                            <h3>Total Reviews</h3>
                            <span>
                                {selectedCourseReviews.length}
                            </span>
                        </div>

                    </div>

                </section>


                {/* =========================
                    AI SUMMARY
                ========================= */}

                <section className="admin-section">

                    <h2>📋 AI Summary</h2>

                    {!selectedCourseId ? (

                        <div className="summary-card">
                            <p>
                                Select a course and click
                                <strong>
                                    {" Generate AI Analysis "}
                                </strong>
                                to view the saved AI insights.
                            </p>
                        </div>

                    ) : aiAnalyses.length === 0 ? (

                        <div className="summary-card">
                            <p>
                                No AI analysis available
                                for the selected course.
                            </p>
                        </div>

                    ) : (

                        <div className="summary-grid">

                            <div className="summary-card strengths">

                                <h3>
                                    ✅ AI Summaries
                                </h3>

                                <ul>

                                    {aiAnalyses
                                        .filter(
                                            (analysis) =>
                                                analysis?.summary
                                        )
                                        .map(
                                            (
                                                analysis,
                                                index
                                            ) => (
                                                <li
                                                    key={
                                                        index
                                                    }
                                                >
                                                    {
                                                        analysis.summary
                                                    }
                                                </li>
                                            )
                                        )}

                                </ul>

                            </div>


                            <div className="summary-card">

                                <h3>
                                    🏷️ Keywords
                                </h3>

                                {aiKeywords.length === 0 ? (

                                    <p>
                                        No keywords
                                        available.
                                    </p>

                                ) : (

                                    <ul>

                                        {aiKeywords.map(
                                            (
                                                keyword,
                                                index
                                            ) => (
                                                <li
                                                    key={
                                                        index
                                                    }
                                                >
                                                    {
                                                        keyword
                                                    }
                                                </li>
                                            )
                                        )}

                                    </ul>

                                )}

                            </div>


                            <div className="summary-card suggestions">

                                <h3>
                                    📊 Analysis Count
                                </h3>

                                <ul>
                                    <li>
                                        Reviews:{" "}
                                        {
                                            selectedCourseReviews.length
                                        }
                                    </li>

                                    <li>
                                        AI Analysed:{" "}
                                        {
                                            aiAnalyses.length
                                        }
                                    </li>

                                    <li>
                                        Positive:{" "}
                                        {
                                            aiStats.positive
                                        }%
                                    </li>

                                    <li>
                                        Neutral:{" "}
                                        {
                                            aiStats.neutral
                                        }%
                                    </li>

                                    <li>
                                        Negative:{" "}
                                        {
                                            aiStats.negative
                                        }%
                                    </li>
                                </ul>

                            </div>

                        </div>

                    )}

                </section>

            </div>

        </Layout>
    );
}

export default Admin;
import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout/Layout";
import "./AIAnalysis.css";

import {
    getAllCourses,
    getCourseSummary
} from "../../services/courseService";

import {
    getAllReviews
} from "../../services/reviewService";

import {
    getAnalysesForReviews
} from "../../services/analysisService";


function AIAnalysis() {

    const [courses, setCourses] = useState([]);
    const [courseSummary, setCourseSummary] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [selectedCourseId, setSelectedCourseId] =
        useState("");

    const [analyses, setAnalyses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [analysisLoading, setAnalysisLoading] =
        useState(false);

    const [error, setError] = useState("");


    // =========================
    // LOAD COURSES + REVIEWS
    // =========================

    useEffect(() => {

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

                const courseList =
                    Array.isArray(coursesData)
                        ? coursesData
                        : [];

                setCourses(courseList);

                setCourseSummary(
                    Array.isArray(summaryData)
                        ? summaryData
                        : []
                );

                setReviews(
                    Array.isArray(reviewsData)
                        ? reviewsData
                        : []
                );

                if (courseList.length > 0) {
                    setSelectedCourseId(
                        String(courseList[0].courseId)
                    );
                }

            } catch (err) {

                console.error(
                    "AI Analysis loading error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Failed to load course analysis data."
                );

            } finally {

                setLoading(false);
            }
        };

        loadData();

    }, []);


    // =========================
    // SELECTED COURSE
    // =========================

    const selectedCourse = useMemo(() => {

        return courses.find(
            (course) =>
                String(course.courseId) ===
                String(selectedCourseId)
        );

    }, [
        courses,
        selectedCourseId
    ]);


    // =========================
    // COURSE REVIEWS
    // =========================

    const selectedReviews = useMemo(() => {

        if (!selectedCourse) {
            return [];
        }

        return reviews.filter(
            (review) =>
                String(review.courseName) ===
                String(selectedCourse.courseName)
        );

    }, [
        reviews,
        selectedCourse
    ]);


    // =========================
    // COURSE SUMMARY
    // =========================

    const selectedSummary = useMemo(() => {

        return courseSummary.find(
            (course) =>
                String(course.courseId) ===
                String(selectedCourseId)
        );

    }, [
        courseSummary,
        selectedCourseId
    ]);


    // =========================
    // LOAD AI ANALYSIS
    // =========================

    useEffect(() => {

        if (!selectedCourse) {
            setAnalyses([]);
            return;
        }

        const loadAnalysis = async () => {

            try {

                setAnalysisLoading(true);
                setError("");

                if (selectedReviews.length === 0) {
                    setAnalyses([]);
                    return;
                }

                const results =
                    await getAnalysesForReviews(
                        selectedReviews
                    );

                setAnalyses(results);

            } catch (err) {

                console.error(
                    "AI analysis error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Failed to load AI analysis."
                );

                setAnalyses([]);

            } finally {

                setAnalysisLoading(false);
            }
        };

        loadAnalysis();

    }, [
        selectedCourse,
        selectedReviews
    ]);


    // =========================
    // SENTIMENT
    // =========================

    const sentiment = useMemo(() => {

        let positive = 0;
        let neutral = 0;
        let negative = 0;

        analyses.forEach((analysis) => {

            const value =
                String(
                    analysis?.sentiment || ""
                ).toLowerCase();

            if (value.includes("positive")) {
                positive++;
            } else if (value.includes("negative")) {
                negative++;
            } else {
                neutral++;
            }
        });

        const total = analyses.length;

        if (!total) {
            return {
                positive: 0,
                neutral: 0,
                negative: 0
            };
        }

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

    }, [analyses]);


    // =========================
    // KEYWORDS
    // =========================

    const keywords = useMemo(() => {

        const values = [];

        analyses.forEach((analysis) => {

            if (!analysis?.keywords) {
                return;
            }

            if (Array.isArray(analysis.keywords)) {

                analysis.keywords.forEach(
                    (keyword) => {
                        if (keyword) {
                            values.push(
                                String(keyword).trim()
                            );
                        }
                    }
                );

            } else {

                String(analysis.keywords)
                    .split(",")
                    .forEach((keyword) => {

                        const value =
                            keyword.trim();

                        if (value) {
                            values.push(value);
                        }
                    });
            }
        });

        return [
            ...new Set(values)
        ];

    }, [analyses]);


    // =========================
    // SUMMARY
    // =========================

    const summaries = useMemo(() => {

        return analyses
            .map(
                (analysis) =>
                    analysis?.summary
            )
            .filter(Boolean);

    }, [analyses]);


    // =========================
    // RENDER
    // =========================

    if (loading) {

        return (
            <Layout>

                <div className="analysis-page">

                    <div className="analysis-loading">
                        Loading AI course analysis...
                    </div>

                </div>

            </Layout>
        );
    }


    return (
        <Layout>

            <div className="analysis-page">

                <div className="analysis-header">

                    <h1>
                        🤖 AI Course Analysis
                    </h1>

                    <p>
                        AI-powered insights generated
                        from actual student reviews.
                    </p>

                </div>


                {error && (
                    <div className="analysis-error">
                        {error}
                    </div>
                )}


                {/* COURSE SELECTOR */}

                <div className="course-selector">

                    <label>
                        Select Course
                    </label>

                    <select
                        value={selectedCourseId}
                        onChange={(e) =>
                            setSelectedCourseId(
                                e.target.value
                            )
                        }
                    >

                        {courses.length === 0 ? (

                            <option value="">
                                No courses available
                            </option>

                        ) : (

                            courses.map((course) => (

                                <option
                                    key={course.courseId}
                                    value={course.courseId}
                                >
                                    {course.courseName}
                                </option>

                            ))

                        )}

                    </select>

                </div>


                {analysisLoading ? (

                    <div className="analysis-loading">
                        Loading AI insights...
                    </div>

                ) : (

                    <>

                        {/* STATS */}

                        <div className="stats-grid">

                            <div className="stat-card">

                                <h3>
                                    ⭐ Average Rating
                                </h3>

                                <h2>
                                    {Number(
                                        selectedSummary?.averageRating ||
                                        0
                                    ).toFixed(1)}
                                    /5
                                </h2>

                            </div>


                            <div className="stat-card positive">

                                <h3>
                                    🟢 Positive
                                </h3>

                                <h2>
                                    {sentiment.positive}%
                                </h2>

                            </div>


                            <div className="stat-card neutral">

                                <h3>
                                    🟡 Neutral
                                </h3>

                                <h2>
                                    {sentiment.neutral}%
                                </h2>

                            </div>


                            <div className="stat-card negative">

                                <h3>
                                    🔴 Negative
                                </h3>

                                <h2>
                                    {sentiment.negative}%
                                </h2>

                            </div>

                        </div>


                        {/* SUMMARY */}

                        <div className="summary-card">

                            <h2>
                                AI Summary
                            </h2>

                            {summaries.length === 0 ? (

                                <p>
                                    No AI analysis is available
                                    for the reviews of this course.
                                </p>

                            ) : (

                                <div className="analysis-summary-list">

                                    {summaries.map(
                                        (summary, index) => (

                                            <p
                                                key={index}
                                            >
                                                {summary}
                                            </p>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        {/* KEYWORDS */}

                        <div className="keywords-card">

                            <h2>
                                Top Keywords
                            </h2>

                            {keywords.length === 0 ? (

                                <p>
                                    No keywords available.
                                </p>

                            ) : (

                                <div className="keyword-list">

                                    {keywords.map(
                                        (word, index) => (

                                            <span
                                                key={index}
                                                className="keyword"
                                            >
                                                {word}
                                            </span>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        {/* ANALYSIS INFORMATION */}

                        <div className="keywords-card">

                            <h2>
                                📊 Analysis Information
                            </h2>

                            <div className="analysis-info-grid">

                                <div>
                                    <strong>
                                        Total Reviews
                                    </strong>

                                    <span>
                                        {selectedReviews.length}
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        AI Analysed
                                    </strong>

                                    <span>
                                        {analyses.length}
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Positive
                                    </strong>

                                    <span>
                                        {sentiment.positive}%
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Neutral
                                    </strong>

                                    <span>
                                        {sentiment.neutral}%
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Negative
                                    </strong>

                                    <span>
                                        {sentiment.negative}%
                                    </span>
                                </div>

                            </div>

                        </div>

                    </>

                )}

            </div>

        </Layout>
    );
}

export default AIAnalysis;
import "./CourseCard.css";

function CourseCard({ course }) {
    return (
        <div className="course-card">

            <h2>{course.courseName}</h2>

            <p>{course.description}</p>

            <div className="course-rating">

                ⭐ {course.averageRating.toFixed(1)} / 5

            </div>

            <div className="course-reviews">

                {course.totalReviews} Reviews

            </div>

        </div>
    );
}

export default CourseCard;
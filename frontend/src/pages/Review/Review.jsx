import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitReview } from "../../services/reviewService";
import "./Review.css";

function Review() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");

    const handleSubmit = async () => {

        try {

            await submitReview({
                courseId: Number(id),
                rating,
                review
            });

            alert("Review submitted successfully!");

            navigate("/courses");

        } catch (err) {

            console.error(err);
            alert("Failed to submit review");

        }
    };

    return (

        <div className="review-container">

            <div className="review-card">

                <h2>Submit Review</h2>

                <label>Rating</label>

                <select
                    value={rating}
                    onChange={(e)=>setRating(Number(e.target.value))}
                >

                    <option value={5}>⭐⭐⭐⭐⭐</option>
                    <option value={4}>⭐⭐⭐⭐</option>
                    <option value={3}>⭐⭐⭐</option>
                    <option value={2}>⭐⭐</option>
                    <option value={1}>⭐</option>

                </select>

                <label>Your Review</label>

                <textarea

                    rows="6"
                    value={review}
                    onChange={(e)=>setReview(e.target.value)}

                />

                <button onClick={handleSubmit}>
                    Submit Review
                </button>

            </div>

        </div>

    );

}

export default Review;
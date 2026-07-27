package com.gurushankar.aicoursereview.service;

import com.gurushankar.aicoursereview.dto.CourseRequest;
import com.gurushankar.aicoursereview.dto.CourseResponse;

import java.util.List;

public interface CourseService {

    // Add a new course
    CourseResponse addCourse(CourseRequest courseRequest);

    // Get all courses
    List<CourseResponse> getAllCourses();

    // Get course by ID
    CourseResponse getCourseById(Long courseId);

    // Update course
    CourseResponse updateCourse(Long courseId, CourseRequest courseRequest);

    // Delete course
    void deleteCourse(Long courseId);
}
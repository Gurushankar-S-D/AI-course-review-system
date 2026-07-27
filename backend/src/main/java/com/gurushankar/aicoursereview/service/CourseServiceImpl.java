package com.gurushankar.aicoursereview.service;

import com.gurushankar.aicoursereview.dto.CourseRequest;
import com.gurushankar.aicoursereview.dto.CourseResponse;
import com.gurushankar.aicoursereview.entity.Course;
import com.gurushankar.aicoursereview.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    public CourseResponse addCourse(CourseRequest courseRequest) {

        Course course = Course.builder()
                .courseName(courseRequest.getCourseName())
                .description(courseRequest.getDescription())
                .build();

        Course savedCourse = courseRepository.save(course);

        return mapToResponse(savedCourse);
    }

    @Override
    public List<CourseResponse> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponse getCourseById(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found with ID: " + courseId));

        return mapToResponse(course);
    }

    @Override
    public CourseResponse updateCourse(Long courseId, CourseRequest courseRequest) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found with ID: " + courseId));

        course.setCourseName(courseRequest.getCourseName());
        course.setDescription(courseRequest.getDescription());

        Course updatedCourse = courseRepository.save(course);

        return mapToResponse(updatedCourse);
    }

    @Override
    public void deleteCourse(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found with ID: " + courseId));

        courseRepository.delete(course);
    }

    private CourseResponse mapToResponse(Course course) {

        return CourseResponse.builder()
                .courseId(course.getCourseId())
                .courseName(course.getCourseName())
                .description(course.getDescription())
                .build();
    }
}
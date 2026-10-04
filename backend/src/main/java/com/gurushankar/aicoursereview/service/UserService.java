package com.gurushankar.aicoursereview.service;
import com.gurushankar.aicoursereview.dto.UserResponse;
import com.gurushankar.aicoursereview.dto.UserRegistrationRequest;
import com.gurushankar.aicoursereview.entity.User;
import com.gurushankar.aicoursereview.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public UserResponse registerUser(UserRegistrationRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .userId(savedUser.getUserId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(userId);
    }
}
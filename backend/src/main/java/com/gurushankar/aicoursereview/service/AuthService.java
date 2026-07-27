package com.gurushankar.aicoursereview.service;

import com.gurushankar.aicoursereview.dto.LoginRequest;
import com.gurushankar.aicoursereview.dto.LoginResponse;
import com.gurushankar.aicoursereview.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );

        String token = jwtUtil.generateToken(authentication.getName());

        return LoginResponse.builder()
                .token(token)
                .username(authentication.getName())
                .role(authentication.getAuthorities().iterator().next().getAuthority())
                .message("Login successful")
                .build();
    }
}
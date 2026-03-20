package com.movie.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.movie.demo.dto.LoginRequest;
import com.movie.demo.dto.RegisterRequest;
import com.movie.demo.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://movie-matrix-gamma.vercel.app"
})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        // Check if user is actually authenticated (not anonymous)
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.status(401)
                    .body("Not authenticated — please provide a valid token");
        }

        // Pass the username to the service
        return authService.getProfile(authentication.getName());
    }
}
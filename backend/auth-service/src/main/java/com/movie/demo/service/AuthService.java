package com.movie.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import com.movie.demo.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.movie.demo.dto.LoginRequest;
import com.movie.demo.dto.RegisterRequest;
import com.movie.demo.repository.UserRepository;
import com.movie.demo.security.JwtUtil;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String register(RegisterRequest request){
        if(!request.getPassword().equals(request.getConfirmPassword())){
            throw new RuntimeException("Passwords do not match");
        }

        User user = new User();

        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setDob(request.getDob());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setCountry(request.getCountry());

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        userRepository.save(user);

        return "User registered successfully!";
    }

    public String login(LoginRequest request){
        User user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getEmail())
        .orElseThrow(()-> new RuntimeException("User not found!"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid Exception");
        }
        return jwtUtil.generateToken(user.getUsername());
    }
}

package com.example.stayease.controllers;
import com.example.stayease.DTOs.AuthRequest;
import com.example.stayease.DTOs.CreateUserDTO;
import com.example.stayease.mappers.UserMapper;
import com.example.stayease.models.User;
import com.example.stayease.repositories.UserRepository;
import com.example.stayease.services.JwtService;
import com.example.stayease.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<CreateUserDTO> register(@RequestBody CreateUserDTO userDTO) {

        try {
            if (userService.existsByEmail(userDTO.getEmail())) {
                System.out.println("Email already exists" + userDTO.getEmail());
                return new ResponseEntity<>(userDTO, HttpStatus.BAD_REQUEST);
            }

            User user = UserMapper.toCreateEntity(userDTO);

            user.setPassword(passwordEncoder.encode(user.getPassword()));

            User savedUser = userService.createUser(user);

            String token = jwtService.generateToken(savedUser);

            CreateUserDTO responseDTO = new CreateUserDTO(
                    savedUser.getId(),
                    savedUser.getFullName(),
                    savedUser.getUsername(),
                    savedUser.getEmail(),
                    savedUser.getPassword(),
                    savedUser.getRole()
            );
            responseDTO.setToken(token);

            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return new ResponseEntity<>(userDTO, HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AuthRequest request) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        UserDetails user = (UserDetails) authentication.getPrincipal();
        String jwt = jwtService.generateToken(user);

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);

        return ResponseEntity.ok(response);
    }

}

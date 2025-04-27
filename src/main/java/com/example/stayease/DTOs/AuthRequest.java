package com.example.stayease.DTOs;
import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}

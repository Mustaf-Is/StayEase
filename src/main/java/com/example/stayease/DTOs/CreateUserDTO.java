package com.example.stayease.DTOs;

import com.example.stayease.enums.UserRole;
import lombok.Getter;

public record CreateUserDTO(
        Integer id,
        String fullName,
        String username,
        String email,
        String password,
        UserRole role
) {
    public String getEmail() {
        return email;
    }

    public String setToken(String token) {
        return token;
    }
}

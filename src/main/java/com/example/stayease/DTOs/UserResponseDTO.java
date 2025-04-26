package com.example.stayease.DTOs;

import com.example.stayease.enums.UserRole;
import com.example.stayease.models.Ads;

import java.util.List;

public record UserResponseDTO(
        Integer id,
        String fullName,
        String email,
        String password,
        UserRole role,
        List<AdResponseDTO> ads
) {

}

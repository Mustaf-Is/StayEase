package com.example.stayease.DTOs;

import com.example.stayease.enums.Rating;

public record ReviewResponseDTO(
        String comment,
        Rating rating,
        Integer adId,
        Integer userId
) {
}

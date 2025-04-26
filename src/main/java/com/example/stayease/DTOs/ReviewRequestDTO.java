package com.example.stayease.DTOs;

import com.example.stayease.models.Reviews;

public record ReviewRequestDTO(
        Reviews review,
        Integer adId,
        Integer userId
) {
}

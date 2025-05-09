package com.example.stayease.DTOs;

import com.example.stayease.enums.AdsType;

import java.time.LocalDateTime;

public record AdResponseDTO(
        Integer id,
        String title,
        String description,
        LocalDateTime pubDate,
        AdsType type,
        double pricePerDay,
        double pricePerWeek,
        double pricePerMonth,
        Integer userId
) {
}

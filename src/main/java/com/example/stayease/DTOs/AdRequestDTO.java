package com.example.stayease.DTOs;

import com.example.stayease.models.Ads;

public record AdRequestDTO(
        Ads ad,
        Integer userId
) {
}

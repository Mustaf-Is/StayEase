package com.example.stayease.models;
import com.example.stayease.enums.Rating;
import com.example.stayease.keys.ReviewId;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Reviews {
    @EmbeddedId
    private ReviewId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("adId")
    @JoinColumn(name = "ad_id")
    private Ads ad;

    @Enumerated(EnumType.STRING)
    @Column(name = "rating", nullable = false)
    private Rating rating;

    @Column(name = "comment")
    private String comment;
}

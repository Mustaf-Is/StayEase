package com.example.stayease.keys;
import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;

@Embeddable
@Data
public class ReviewId implements Serializable {
    private int userId;
    private int adId;

    public ReviewId() {
    }

    public ReviewId(int userId, int adId) {
        this.userId = userId;
        this.adId = adId;
    }
}

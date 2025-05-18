package com.example.stayease.repositories;

import com.example.stayease.models.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Integer> {
//    Image save(String url, Integer adId);

    @Query(value = "CALL sp_save_image(:url, :adId)", nativeQuery = true)
    Image saveImage(@Param("url") String url, @Param("adId") Integer adId);

    @Query(value = "CALL sp_get_urls_per_ad(:adId)", nativeQuery = true)
    List<String> urlsPerAd(@Param("adId") Integer adId);
}

package com.example.stayease.repositories;
import com.example.stayease.models.Ads;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AdRepository extends JpaRepository<Ads, Integer> {
    @Query(value = "CALL sp_find_all_ads()", nativeQuery = true)
    List<Ads> findAllAds();

    @Query(value = "CALL sp_find_ad_by_id(:id)", nativeQuery = true)
    Optional<Ads> findAdById(@Param("id") Integer id);

    @Query(value = "CALL sp_save_ad(:#{#ad.title}, :#{#ad.description}, :#{#ad.pubDate}, :#{#ad.type}, :#{#ad.price}, :#{#ad.user})", nativeQuery = true)
    Ads saveAd(@Param("ad") Ads ad);

    @Query(value = "CALL sp_update_ad(:#{#ad.id}, :#{#ad.title}, :#{#ad.description}, :#{#ad.pubDate}, :#{#ad.type}, :#{#ad.price})", nativeQuery = true)
    Ads updateAd(@Param("ad") Ads ad);

    @Query(value = "CALL sp_delete_ad(:id)", nativeQuery = true)
    void deleteAdById(@Param("id") Integer id);
}

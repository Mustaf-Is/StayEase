package com.example.stayease.repositories;
import com.example.stayease.enums.UserRole;
import com.example.stayease.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * TODO: Me e ndryshu edhe update-in edhe gjithashtu me rregullu problemin e reviews
 */


public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    @Query(value = "CALL sp_find_all_users()", nativeQuery = true)
    List<User> findAllUsers();

    @Query(value = "CALL sp_find_user_by_id(:id)", nativeQuery = true)
    Optional<User> findUserById(@Param("id") Integer id);

    @Query(value = "CALL sp_save_user(:fullName,:email, :password, :role, :username)",
            nativeQuery = true)
    User saveUser(@Param("fullName") String fullName,
                  @Param("email") String email,
                  @Param("password") String password,
                  @Param("role") UserRole role,
                  @Param("username") String username);

    @Query(value = "CALL sp_update_user(:id, :fullName, :email, :password, :role, :username)",
            nativeQuery = true)
    User updateUser(@Param("id") Integer id,
                    @Param("fullName") String fullName,
                    @Param("email") String email,
                    @Param("password") String password,
                    @Param("role") UserRole role,
                    @Param("username") String username);

    @Procedure("stayease.sp_delete_user")
    @Transactional
    void deleteUserById(@Param("id") Integer id);
}
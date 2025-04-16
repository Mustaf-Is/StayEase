package com.example.stayease.repositories;
import com.example.stayease.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    @Query(value = "CALL sp_find_all_users()", nativeQuery = true)
    List<User> findAllUsers();

    @Query(value = "CALL sp_find_user_by_id(:id)", nativeQuery = true)
    Optional<User> findUserById(@Param("id") Integer id);

    @Query(value = "CALL sp_save_user(:#{#user.fullName}, :#{#user.email}, :#{#user.password}, :#{#user.role})",
            nativeQuery = true)
    User saveUser(@Param("user") User user);

    @Query(value = "CALL sp_update_user(:#{#user.id}, :#{#user.fullName}, :#{#user.email}, :#{#user.password}, :#{#user.role})",
            nativeQuery = true)
    User updateUser(@Param("user") User user);

    @Query(value = "CALL sp_delete_user(:id)", nativeQuery = true)
    void deleteUserById(@Param("id") Integer id);
}
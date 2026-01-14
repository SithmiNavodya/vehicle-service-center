// UserProfileRepository.java
package com.vsc.vehicle_service_backend.repository;

import com.vsc.vehicle_service_backend.entity.UserProfile;
import com.vsc.vehicle_service_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    // Both methods should work
    Optional<UserProfile> findByUser(User user);

    @Query("SELECT p FROM UserProfile p WHERE p.user.id = :userId")
    Optional<UserProfile> findByUserId(@Param("userId") Long userId);

    Optional<UserProfile> findByEmail(String email);

    // Fix the parameter name
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM UserProfile p WHERE p.email = :email AND p.id != :id")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("id") Long id);
}
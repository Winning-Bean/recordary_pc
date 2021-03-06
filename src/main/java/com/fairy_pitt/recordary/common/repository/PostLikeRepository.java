package com.fairy_pitt.recordary.common.repository;

import com.fairy_pitt.recordary.common.domain.PostEntity;
import com.fairy_pitt.recordary.common.domain.PostLikeEntity;
import com.fairy_pitt.recordary.common.domain.UserEntity;
import com.fairy_pitt.recordary.common.pk.PostLikePK;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostLikeRepository extends JpaRepository<PostLikeEntity, PostLikePK> {
    PostLikeEntity findByPostFKAndUserFK(PostEntity postFK, UserEntity userFK);

    List<PostLikeEntity> findAllByPostFK(PostEntity postFK);
    List<PostLikeEntity> findAllByUserFK(UserEntity userFK);
}

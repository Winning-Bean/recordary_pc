package com.fairy_pitt.recordary.common.repository;

import com.fairy_pitt.recordary.common.entity.GroupEntity;
import com.fairy_pitt.recordary.common.entity.PostEntity;
import com.fairy_pitt.recordary.common.entity.ScheduleEntity;
import com.fairy_pitt.recordary.common.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<PostEntity, Long> {
    PostEntity findByPostCd(Long postCd);
    PostEntity findByScheduleFK(ScheduleEntity scheduleEntity);

    List<PostEntity> findAllByUserFKOrderByCreatedDateDesc(UserEntity userFK);
    List<PostEntity> findAllByUserFKAndPostPublicStateOrderByCreatedDateDesc(UserEntity userEntity, int publicState);
    List<PostEntity> findAllByUserFKAndGroupFKAndPostPublicStateLessThanEqualOrderByCreatedDateDesc(UserEntity userEntity, GroupEntity groupEntity, int publicState);
    List<PostEntity> findAllByGroupFKOrderByCreatedDateDesc(GroupEntity groupEntity);

    List<PostEntity> findAllByPostExLike(String postEx);
    List<PostEntity> findAllByPostExLikeAndUserFK(String postEx, UserEntity userEntity);
    List<PostEntity> findAllByPostExLikeAndGroupFK(String postEx, GroupEntity groupEntity);
    List<PostEntity> findAllByPostOriginFK(PostEntity postOriginFK);
    List<PostEntity> findAllByPostPublicState(int postPublicState);

    List<PostEntity> findAllByUserFKAndPostPublicState(UserEntity userFK, int postPublicState);
    List<PostEntity> findAllByGroupFKAndPostPublicState(GroupEntity groupFK, int postPublicState);

    List<PostEntity> findAllByOrderByCreatedDateDesc();
}

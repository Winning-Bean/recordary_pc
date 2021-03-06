package com.fairy_pitt.recordary.common.repository;

import com.fairy_pitt.recordary.common.domain.GroupApplyEntity;
import com.fairy_pitt.recordary.common.domain.GroupEntity;
import com.fairy_pitt.recordary.common.domain.UserEntity;
import com.fairy_pitt.recordary.common.pk.GroupMemberPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupApplyRepository extends JpaRepository<GroupApplyEntity, GroupMemberPK> {

   List<GroupApplyEntity> findAllByUserFKAndAndApplyState(UserEntity userEntity, int applyState);
   List<GroupApplyEntity> findAllByGroupFKAndApplyState(GroupEntity groupEntity, int applyState);
}

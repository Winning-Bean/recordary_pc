package com.fairy_pitt.recordary.endpoint.group.dto;

import com.fairy_pitt.recordary.common.entity.GroupApplyEntity;
import com.fairy_pitt.recordary.common.entity.GroupEntity;
import com.fairy_pitt.recordary.common.entity.UserEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GroupMemberResponseDto {

    private GroupEntity groupCodeFK;
    private UserEntity userCodeFK;

    public GroupMemberResponseDto(GroupApplyEntity entity)
    {
        this.groupCodeFK = entity.getGroupCodeFK();
        this.userCodeFK = entity.getUserCodeFK();
    }
}
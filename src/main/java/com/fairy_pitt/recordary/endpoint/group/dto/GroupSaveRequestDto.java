package com.fairy_pitt.recordary.endpoint.group.dto;

import com.fairy_pitt.recordary.common.entity.GroupEntity;
import com.fairy_pitt.recordary.common.entity.UserEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
public class GroupSaveRequestDto {

    private UserEntity gMstUserFK;
    private String groupName;
    private Boolean groupState;
    private String groupEx;
    private String groupPic;

   @Builder
   public GroupSaveRequestDto(UserEntity gMstUserFK, String groupName, Boolean groupState, String groupPic, String  groupEx)
   {
      this.gMstUserFK = gMstUserFK;
      this.groupName = groupName;
      this.groupState = groupState;
      this.groupPic = groupPic;
      this.groupEx = groupEx;
   }

   public GroupEntity toEntity(){
    return GroupEntity.builder()
            //.gMstUserFK(gMstUserFK)
            .groupEx(groupEx)
            .groupName(groupName)
            .groupState(groupState)
            .groupPic(groupPic)
            .build();
   }
}
package com.fairy_pitt.recordary.endpoint.Schedule.dto;

import com.fairy_pitt.recordary.common.entity.ScheduleTabEntity;
import com.fairy_pitt.recordary.common.entity.UserEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class ScheduleTabRequestDto {

    private Long userCd;
    private String tabNm;
    private String tabCol;

    @Builder(builderClassName = "createScheduleTabBuilder", builderMethodName = "createScheduleTabBuilder")
    public ScheduleTabRequestDto(Long userCd,
                                 String tabNm,
                                 String tabCol) {
        this.userCd = userCd;
        this.tabCol = tabCol;
        this.tabNm = tabNm;
    }

    public ScheduleTabEntity toEntity(UserEntity user){
        return ScheduleTabEntity.builder()
                .userFk(user)
                .tabNm(tabNm)
                .tabCol(tabCol)
                .build();
    }
}

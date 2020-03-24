package com.fairy_pitt.recordary.endpoint.Schedule.dto;

import com.fairy_pitt.recordary.common.entity.PostEntity;
import com.fairy_pitt.recordary.common.entity.ScheduleEntity;
import com.fairy_pitt.recordary.common.entity.ScheduleTabEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@Getter
public class ScheduleResponseDto {

    private Long scheduleCd;
    private ScheduleTabEntity TabCodeFK;
    private PostEntity PostFK;
    private String scheduleNm;
    private String scheduleEx;
    private Date scheduleStr;
    private Date scheduleEnd;
    private String scheduleCol;

    public ScheduleResponseDto(ScheduleEntity entity) {
        this.scheduleCd = entity.getScheduleCd();
        this.TabCodeFK = entity.getTabCodeFK();
        this.PostFK = entity.getPostFK();
        this.scheduleNm = entity.getScheduleNm();
        this.scheduleEx = entity.getScheduleEx();
        this.scheduleStr = entity.getScheduleStr();
        this.scheduleEnd = entity.getScheduleEnd();
        this.scheduleCol = entity.getScheduleCol();
    }
}
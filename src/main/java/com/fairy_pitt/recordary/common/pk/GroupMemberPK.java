package com.fairy_pitt.recordary.common.pk;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Embeddable
public class GroupMemberPK implements Serializable {

    private Long groupCodeFK;
    private Long userCodeFK;

}
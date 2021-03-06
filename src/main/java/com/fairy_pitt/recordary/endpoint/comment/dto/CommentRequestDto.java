package com.fairy_pitt.recordary.endpoint.comment.dto;

import com.fairy_pitt.recordary.common.domain.CommentEntity;
import com.fairy_pitt.recordary.common.domain.PostEntity;
import com.fairy_pitt.recordary.common.domain.UserEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentRequestDto {
    private Long userCd;
    private Long postCd;
    private String commentContent;
    private Long commentOriginCd;

    public CommentEntity toEntity(UserEntity user, PostEntity Post, CommentEntity comment){
        return CommentEntity.builder()
                .commentUserFK(user)
                .commentPostFK(Post)
                .commentOriginFK(comment)
                .commentContent(commentContent)
                .build();
    }

}

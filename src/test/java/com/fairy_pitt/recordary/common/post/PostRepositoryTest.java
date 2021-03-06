package com.fairy_pitt.recordary.common.post;

import com.fairy_pitt.recordary.common.domain.PostEntity;
import com.fairy_pitt.recordary.common.domain.UserEntity;
import com.fairy_pitt.recordary.common.repository.PostRepository;
import com.fairy_pitt.recordary.common.repository.UserRepository;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PostRepositoryTest {

    @Autowired
    PostRepository postRepository;
    @Autowired
    UserRepository userRepository;

    @After
    public void cleanup() {
        postRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    public void 게시글저장_불러오기() {
        //given
        UserEntity user1 = userRepository.save(UserEntity.builder()
                .userId("testUser1")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());

        String postEx = "테스트 게시글";
        int postPublicState = 1;
        String postStrYMD = "20200310";
        String postEndYMD = "20200311";

        postRepository.save(PostEntity.builder()
                .userFK(user1)
                .postEx(postEx)
                .postPublicState(postPublicState)
                .postScheduleShareState(false)
                .build());

        //when
        List<PostEntity> postEntityList = postRepository.findAll();

        //then
        PostEntity postEntity = postEntityList.get(0);
        assertThat(postEntity.getUserFK().getUserCd()).isEqualTo(user1.getUserCd());
        assertThat(postEntity.getPostEx()).isEqualTo(postEx);
        assertThat(postEntity.getPostPublicState()).isEqualTo(postPublicState);
        assertThat(postEntity.getPostScheduleShareState()).isEqualTo(false);
    }

    @Test
    public void BaseTime_등록() {
        //given
        LocalDateTime now = LocalDateTime.of(2020, 3, 11, 0, 0, 0);

        UserEntity user1 = userRepository.save(UserEntity.builder()
                .userId("testUser1")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());

        postRepository.save(PostEntity.builder()
                .userFK(user1)
                .postEx("테스트 게시글")
                .postPublicState(1)
                .postScheduleShareState(false)
                .build());
        //when
        List<PostEntity> postEntityList = postRepository.findAll();

        //then
        PostEntity postEntity = postEntityList.get(0);

        System.out.println(">>>>>>>>> createDate=" + postEntity.getCreatedDate() + ", modifiedDate=" + postEntity.getModifiedDate());

        assertThat(postEntity.getCreatedDate()).isAfter(now);
        assertThat(postEntity.getModifiedDate()).isAfter(now);
    }
}
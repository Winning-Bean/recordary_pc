package com.fairy_pitt.recordary.endpoint.schedule;

import com.fairy_pitt.recordary.common.domain.*;
import com.fairy_pitt.recordary.common.repository.*;
import com.fairy_pitt.recordary.endpoint.post.dto.PostResponseDto;
import com.fairy_pitt.recordary.endpoint.schedule.dto.ScheduleSaveRequestDto;
import com.fairy_pitt.recordary.endpoint.schedule.dto.ScheduleTabRequestDto;
import com.fairy_pitt.recordary.endpoint.schedule.dto.ScheduleUpdateRequestDto;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ScheduleControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ScheduleTabRepository scheduleTabRepository;

    @Autowired
    ScheduleMemberRepository scheduleMemberRepository;

    @Autowired
    PostRepository postRepository;

    @After
    public void tearDown(){
        scheduleMemberRepository.deleteAll();
        postRepository.deleteAll();
        scheduleRepository.deleteAll();
        scheduleTabRepository.deleteAll();
        userRepository.deleteAll();
    }


    @Test
    public void Schedule_등록된다() throws Exception {
        //given
        UserEntity user = userRepository.save(UserEntity.builder()
                .userId("testUser1")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());

        UserEntity user2 = userRepository.save(UserEntity.builder()
                .userId("testUser12")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());

        UserEntity user3 = userRepository.save(UserEntity.builder()
                .userId("testUser13")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());



        String scheduleEx = "테스트 게시글";
        String scheduleNm = "Test 게시글";
        List<Long> userCd = new ArrayList<>();
        userCd.add(user2.getUserCd());
        userCd.add(user3.getUserCd());
       // int postPublicState = 1;
        Date scheduleStr = Timestamp.valueOf("2020-03-25 23:59:59");
        Date scheduleEnd = Timestamp.valueOf("2020-03-26 12:13:24");

        ScheduleSaveRequestDto requestDto = ScheduleSaveRequestDto.createScheduleBuilder()
                .groupCd(null)
                .tabCd(null)
                .userCd(user.getUserCd())
                .scheduleNm(scheduleNm)
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr)
                .scheduleEnd(scheduleEnd)
                .scheduleCol(null)
                .scheduleMember(userCd)
                .schedulePublicState(3)
                .build();

        String url = "http://localhost:" + port + "schedule/";

        //when
        ResponseEntity<Long> responseEntity = restTemplate.postForEntity(url, requestDto, Long.class);

        //then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isGreaterThan(0L);

        List<ScheduleEntity> all = scheduleRepository.findAll();
       // List<PostEntity> post = postRepository.findAll();
        assertThat(all.get(0).getScheduleEx()).isEqualTo(scheduleEx);
        assertThat(all.get(0).getScheduleNm()).isEqualTo(scheduleNm);
        assertThat(all.get(0).getScheduleStr()).isEqualTo(scheduleStr);
     //   assertThat((post.size())).isEqualTo(1);
}

    @Test
    public void schedule_수정된다() throws Exception {
        //given
        UserEntity user = userRepository.save(UserEntity.builder()
                .userId("testUser1")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());

        String scheduleEx = "테스트 게시글";
        // int postPublicState = 1;
        Date scheduleStr = Timestamp.valueOf("2020-03-25 12:13:24");
        Date scheduleEnd = Timestamp.valueOf("2020-03-26 12:13:24");

        ScheduleEntity saveSchedule = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr)
                .scheduleEnd(scheduleEnd)
                .scheduleCol(null)
                .schedulePublicState(1)
                .build());

        ScheduleTabEntity tab = scheduleTabRepository.save(ScheduleTabEntity.builder()
                        .tabNm("test")
                        .tabCol(null)
                        .userFk(user)
                        .build());

        Long scheduleCd = saveSchedule.getScheduleCd();
        Long tabCd = tab.getTabCd();
        String scheduleNmChange = "테스트 게시글2";
        String scheduleExChange = "테스트 게시글2";
        Date scheduleStr2 = Timestamp.valueOf("2020-04-25 23:59:59");
        Date scheduleEnd2 = Timestamp.valueOf("2020-04-26 12:13:24");

        ScheduleUpdateRequestDto requestDto = ScheduleUpdateRequestDto.updateScheduleBuilder()
                .tabCd(tabCd)
                .scheduleNm(scheduleNmChange)
                .scheduleEx(scheduleExChange)
                .scheduleStr(scheduleStr2)
                .scheduleEnd(scheduleEnd2)
                .scheduleCol(null)
                .build();

        String url = "http://localhost:" + port + "schedule/update/" + scheduleCd;

       // HttpEntity<ScheduleUpdateRequestDto> requestDtoHttpEntity = new HttpEntity<>(requestDto);

        //when
        ResponseEntity<Long> responseEntity = restTemplate.postForEntity(url,requestDto, Long.class);

        //then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isGreaterThan(0L);

        List<ScheduleEntity> all = scheduleRepository.findAll();
        assertThat(all.get(0).getScheduleEx()).isEqualTo(scheduleExChange);
        assertThat(all.get(0).getScheduleNm()).isEqualTo(scheduleNmChange);
        assertThat(all.get(0).getScheduleStr()).isEqualTo(scheduleStr2);
        assertThat(all.get(0).getTabFK().getTabCd()).isEqualTo(tab.getTabCd());

    }

/*    @Test
    public void schedule_가져오기() throws Exception {

        //given
        UserEntity user = userRepository.save(UserEntity.builder()
                .userId("testUser1")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());

        UserEntity user2 = userRepository.save(UserEntity.builder()
                .userId("testUser2")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());

        UserEntity user3 = userRepository.save(UserEntity.builder()
                .userId("testUser3")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());




       ScheduleTabEntity tab = scheduleTabRepository.save(ScheduleTabEntity.builder()
                .tabNm("test")
                .tabCol(null)
                .userFk(user)
                .build());

        String scheduleEx = "테스트 게시글";
        Date scheduleStr = Timestamp.valueOf("2020-03-25 12:13:24");
        Date scheduleEnd = Timestamp.valueOf("2020-03-26 12:13:24");

        Date scheduleStr2 = Timestamp.valueOf("2020-04-25 12:13:24");
        Date scheduleEnd2 = Timestamp.valueOf("2020-04-26 12:13:24");

        ScheduleEntity saveSchedule = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr)
                .scheduleEnd(scheduleEnd)
                .scheduleCol(null)
                .schedulePublicState(1)
                .build());

        ScheduleEntity saveSchedule2 = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr)
                .scheduleEnd(scheduleEnd)
                .scheduleCol(null)
                .schedulePublicState(2)
                .build());

        ScheduleEntity saveSchedule3 = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user2)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr)
                .scheduleEnd(scheduleEnd)
                .scheduleCol(null)
                .schedulePublicState(3)
                .build());

        ScheduleEntity saveSchedule4 = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(tab)
                .userFK(user)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr2)
                .scheduleEnd(scheduleEnd)
                .scheduleCol(null)
                .schedulePublicState(0)
                .build());

        ScheduleEntity saveSchedule5 = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr2)
                .scheduleEnd(scheduleEnd2)
                .scheduleCol(null)
                .schedulePublicState(0)
                .build());

        ScheduleEntity saveSchedule6 = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr2)
                .scheduleEnd(scheduleEnd2)
                .scheduleCol(null)
                .schedulePublicState(3)
                .build());

        ScheduleEntity saveSchedule7 = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user2)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr2)
                .scheduleEnd(scheduleEnd2)
                .scheduleCol(null)
                .schedulePublicState(3)
                .build());

        ScheduleMemberEntity saveMember = scheduleMemberRepository.save(ScheduleMemberEntity.builder()
        .scheduleState(true)
        .scheduleFK(saveSchedule7)
        .userFK(user3)
        .build());

        scheduleMemberRepository.save(ScheduleMemberEntity.builder().userFK(user2).scheduleFK(saveSchedule5).scheduleState(true).build());
        scheduleMemberRepository.save(ScheduleMemberEntity.builder().userFK(user2).scheduleFK(saveSchedule6).scheduleState(true).build());
        scheduleMemberRepository.save(ScheduleMemberEntity.builder().userFK(user2).scheduleFK(saveSchedule4).scheduleState(true).build());

        Long tabCd = tab.getTabCd();
        Long userCd = user.getUserCd();
        //Long userCd3 = user3.getUserCd();
        Date fromDate = Timestamp.valueOf("2020-02-01 00:00:00");
        Date toDate = Timestamp.valueOf("2020-04-26 23:59:59");

        ScheduleDateRequestDto requestDto = new ScheduleDateRequestDto(fromDate,toDate,tabCd);

        String url = "http://localhost:" + port + "schedule/showUserSchedule/" + userCd ;

        //when
        ResponseEntity<List> responseEntity = restTemplate.postForEntity(url,requestDto,List.class);

        assertThat(responseEntity.getBody().size()).isEqualTo(1);
    }*/


    @Test
    public void schedule_검색() throws Exception {

        //given
        String scheduleEx = "테스트 게시글";
        Date scheduleStr = Timestamp.valueOf("2020-03-25 12:13:24");
        Date scheduleEnd = Timestamp.valueOf("2020-03-26 12:13:24");
        Date scheduleStr2 = Timestamp.valueOf("2020-04-25 12:13:24");
        Date scheduleEnd2 = Timestamp.valueOf("2020-04-26 12:13:24");

        UserEntity user = userRepository.save(UserEntity.builder()
                .userId("testUser1")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());

        UserEntity user2 = userRepository.save(UserEntity.builder()
                .userId("testUser2")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());

        UserEntity user3 = userRepository.save(UserEntity.builder()
                .userId("testUser3")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());

        ScheduleTabEntity tab = scheduleTabRepository.save(ScheduleTabEntity.builder()
                .tabNm("test")
                .tabCol(null)
                .userFk(user)
                .build());

        ScheduleEntity saveSchedule = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr)
                .scheduleEnd(scheduleEnd)
                .scheduleCol(null)
                .schedulePublicState(1)
                .build());

        ScheduleEntity saveSchedule2 = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr)
                .scheduleEnd(scheduleEnd)
                .scheduleCol(null)
                .schedulePublicState(2)
                .build());

        ScheduleEntity saveSchedule3 = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user2)
                .groupFK(null)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr)
                .scheduleEnd(scheduleEnd)
                .scheduleCol(null)
                .schedulePublicState(3)
                .build());

        ScheduleEntity saveSchedule4 = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(tab)
                .userFK(user)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr2)
                .scheduleEnd(scheduleEnd)
                .scheduleCol(null)
                .schedulePublicState(0)
                .build());

        ScheduleEntity saveSchedule5 = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr2)
                .scheduleEnd(scheduleEnd2)
                .scheduleCol(null)
                .schedulePublicState(0)
                .build());

        ScheduleEntity saveSchedule6 = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr2)
                .scheduleEnd(scheduleEnd2)
                .scheduleCol(null)
                .schedulePublicState(3)
                .build());

        scheduleMemberRepository.save(ScheduleMemberEntity.builder().userFK(user2).scheduleFK(saveSchedule5).scheduleState(true).build());
        scheduleMemberRepository.save(ScheduleMemberEntity.builder().userFK(user2).scheduleFK(saveSchedule6).scheduleState(true).build());
        scheduleMemberRepository.save(ScheduleMemberEntity.builder().userFK(user2).scheduleFK(saveSchedule4).scheduleState(true).build());

        String name = "T";
        Long targetCd = user2.getUserCd();
        String url = "http://localhost:" + port + "schedule/search/" + targetCd+ "?input="  + name ;

//        //when
//        ResponseEntity<List> responseEntity = restTemplate.getForEntity(url,List.class);
//
//        assertThat(responseEntity.getBody().size()).isEqualTo(4);

    }

    @Test
    public void schedule_post_가져오기()  throws Exception {

        String scheduleEx = "테스트 게시글";
        Date scheduleStr = Timestamp.valueOf("2020-03-25 12:13:24");
        Date scheduleEnd = Timestamp.valueOf("2020-03-26 12:13:24");

        UserEntity user = userRepository.save(UserEntity.builder()
                .userId("testUser1")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());

        ScheduleEntity saveSchedule = scheduleRepository.save(ScheduleEntity.builder()
                .tabFK(null)
                .userFK(user)
                .scheduleNm("Test")
                .scheduleEx(scheduleEx)
                .scheduleStr(scheduleStr)
                .scheduleEnd(scheduleEnd)
                .scheduleCol(null)
                .schedulePublicState(1)
                .build());

        PostEntity post = postRepository.save(PostEntity.builder()
                .userFK(user)
                .scheduleFK(saveSchedule)
                .postEx("테스트 게시글")
                .postPublicState(1)
                .postScheduleShareState(false)
                .build());

        String url = "http://localhost:" + port + "schedule/findPost/" + saveSchedule.getScheduleCd() ;

        ResponseEntity<PostResponseDto> responseEntity = restTemplate.getForEntity(url, PostResponseDto.class);

        assertThat(responseEntity.getBody().getPostCd()).isEqualTo(post.getPostCd());
        assertThat(responseEntity.getBody().getPostEx()).isEqualTo(post.getPostEx());
    }
}

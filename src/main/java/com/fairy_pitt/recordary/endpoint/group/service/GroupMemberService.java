package com.fairy_pitt.recordary.endpoint.group.service;

import com.fairy_pitt.recordary.common.domain.GroupEntity;
import com.fairy_pitt.recordary.common.domain.GroupMemberEntity;
import com.fairy_pitt.recordary.common.domain.UserEntity;
import com.fairy_pitt.recordary.common.pk.GroupMemberPK;
import com.fairy_pitt.recordary.common.repository.GroupMemberRepository;
import com.fairy_pitt.recordary.common.repository.GroupRepository;
import com.fairy_pitt.recordary.endpoint.group.dto.GroupMemberDto;
import com.fairy_pitt.recordary.endpoint.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class GroupMemberService {

    private final GroupMemberRepository groupMemberRepository;
    private final UserService userService;
    private final GroupRepository groupRepository;

    @Transactional
    public Long save(GroupMemberDto groupMemberDto)
    {
        UserEntity user = userService.findEntity(groupMemberDto.getUserCd());
        GroupEntity group = groupRepository.findByGroupCd(groupMemberDto.getGroupCd());
        GroupMemberEntity groupMemberEntity = groupMemberDto.toEntity(group,user);
       return groupMemberRepository.save(groupMemberEntity).getGroupFK().getGroupCd();
    }

    @Transactional
    public Boolean delete (GroupMemberDto requestDto) {
        GroupMemberPK id = new GroupMemberPK(requestDto.getGroupCd(),requestDto.getUserCd());
        GroupMemberEntity groupMemberEntity = groupMemberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 그룹의 맴버가 없습니다. id=" + id));

        groupMemberRepository.delete(groupMemberEntity);
        return true;
    }

    @Transactional(readOnly = true)
    public GroupMemberEntity findEntity(Long groupCd, Long userCd){
        GroupEntity group = groupRepository.findByGroupCd(groupCd);
        UserEntity user = userService.findEntity(userCd);
        return groupMemberRepository.findByGroupFKAndUserFK(group, user);
    }
}

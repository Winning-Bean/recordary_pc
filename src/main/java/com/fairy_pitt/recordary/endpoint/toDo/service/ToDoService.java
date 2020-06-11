package com.fairy_pitt.recordary.endpoint.toDo.service;

import com.fairy_pitt.recordary.common.entity.ToDoEntity;
import com.fairy_pitt.recordary.common.entity.UserEntity;
import com.fairy_pitt.recordary.common.repository.ToDoRepository;
import com.fairy_pitt.recordary.endpoint.toDo.dto.ToDoResponseDto;
import com.fairy_pitt.recordary.endpoint.toDo.dto.TodoRequestDto;
import com.fairy_pitt.recordary.endpoint.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ToDoService {

    private final ToDoRepository toDoRepository;
    private final UserService userService;

    public Boolean create(TodoRequestDto requestDto){

        UserEntity user = userService.findEntity(requestDto.getUserCd());
        return Optional.ofNullable(toDoRepository.save(requestDto.toEntity(user))).isPresent();
    }

    public Boolean update(Long toDoCd)
    {
        ToDoEntity toDoEntity = toDoRepository.findByToDoCd(toDoCd);
        if(!toDoEntity.getToDoCompleteState())
        {
            toDoEntity.updateToDoState(false);
        }else {
            toDoEntity.updateToDoState(true);
        }
        return true;
    }

    public Boolean delete(Long toDoCd){
        ToDoEntity toDoEntity = Optional.ofNullable(toDoRepository.findByToDoCd(toDoCd))
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. code = " + toDoCd));
        toDoRepository.delete(toDoEntity);

        return true;
    }

    public List<ToDoResponseDto> getCurrTodoList(Long userCd){
        Date today = new Date();
        return toDoRepository.findByUserFKAndToDoEndDateAfter(userService.findEntity(userCd), today)
                .stream()
                .map(ToDoResponseDto :: new)
                .collect(Collectors.toList());
    }

    public List<ToDoResponseDto> getPreTodoList(Long userCd){
        Date today = new Date();
        return toDoRepository.findByUserFKAndToDoEndDateBefore(userService.findEntity(userCd), today)
                .stream()
                .map(ToDoResponseDto :: new)
                .collect(Collectors.toList());
    }

}


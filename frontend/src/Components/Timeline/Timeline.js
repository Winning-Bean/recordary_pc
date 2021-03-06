import React, { useState, useEffect, useRef } from 'react';
import * as dateFns from 'date-fns';
import { styled } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import AlertDialog from '../Other/AlertDialog';

import LikePersonList from './LikePersonList';
import './Timeline.css';
import CommentList from './CommentList';
import LongMenu from '../Other/MoreMenu';
import PostShare from '../../Containers/Profile/PostShare';
import EditPostMediaSchedule from '../../Containers/Profile/EditPostMediaSchedule';

import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import TodayIcon from '@material-ui/icons/Today';
import CloseIcon from '@material-ui/icons/Close';
import CommentTimeline from './CommentTimeline';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import SubdirectoryArrowLeftIcon from '@material-ui/icons/SubdirectoryArrowLeft';

import { Link } from 'react-router-dom';

import store from '../../store';

const useStyles = makeStyles((theme) => ({
  textFieldSize: {
    fontSize: '12px',
    width: '170px',
  },
}));

const extensionImage = ['bmp', 'gif', 'jpeg', 'jpg', 'png'];
const extensionVideo = ['mp4', 'webm', 'ogg'];
const extensionAudio = ['m4a', 'mp3', 'ogg', 'wav'];

const filterTagType = (value) => {
    const len = value.length;
    const lastDot = value.lastIndexOf('.');
    const extension = value.substr(lastDot + 1, len).toLowerCase();
    let filterType = null;

    extensionImage.map((value) => {
        if (extension === value) filterType = 'image';
    });
    extensionVideo.map((value) =>{
        if (extension === value) filterType = 'video';
    });
    extensionAudio.map((value) => {
        if (extension === value) filterType = 'audio';
    });
    return filterType;
};

const Timeline = (props) => {
  const classes = useStyles();
  const [dialog, setDialog] = useState(null);
  const [data, setData] = useState(props.data);
  const [menuDialog, setMenuDialog] = useState(null);
  const [pictureCount, setPictureCount] = useState(0);
  const [clickSchedule, setClickSchedule] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [likePersonList, setLikePersonList] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const mediaSrc = (await axios.get(`/media/${data.mediaFK.mediaCd}`)).data;
        if (mediaSrc.length < 0) {
          return;
        } else {
          setMediaList(mediaSrc);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const userPostMoreButtonClick = (selectedValue, value) => {
    switch (selectedValue) {
      case '나에게 공유':
        setMenuDialog(<PostShare originCd={data.postCd} onCancel={() => setMenuDialog(null)} />);
        break;
      case '수정':
        setMenuDialog(<EditPostMediaSchedule mediaList={mediaList} data={data} onCancel={() => setMenuDialog(null)} />);
        break;
      case '삭제':
        setMenuDialog(
          <Dialog open={true} onClose={() => setMenuDialog(null)}>
            <DialogTitle id='alert-dialog-title'>게시물 삭제</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>게시물을 삭제하시겠습니까?</DialogContentText>
              <DialogContentText style={{ fontSize: '12px', color: 'red' }}>
                *관련된 일정과 미디어도 모두 삭제됩니다.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setMenuDialog(null)} color='primary' autoFocus>
                취소
              </Button>
              <Button
                onClick={async () => {
                  try {
                    const Success = (await axios.delete(`/post/${data.postCd}`)).data;
                    console.log(Success);
                    if (Success) {
                      setDialog(
                        <AlertDialog
                          severity='success'
                          content='게시물이 삭제되었습니다.'
                          duration={1000}
                          onAlertClose={() => {
                            setMenuDialog(null);
                            props.onPostDelete(data.postCd);
                          }}
                        />
                      );
                    } else {
                      setDialog(
                        <AlertDialog
                          severity='success'
                          content='게시물 삭제 실패'
                          duration={1000}
                          onAlertClose={() => setDialog(null)}
                        />
                      );
                    }
                  } catch (e) {
                    console.log(e);
                    setDialog(<AlertDialog severity='error' content='서버에러' onAlertClose={() => setDialog(null)} />);
                  }
                }}
                color='primary'
              >
                확인
              </Button>
            </DialogActions>
          </Dialog>
        );
        break;
    }
  };

  const timelineMediaType = (value) => {
    if (filterTagType(value) === 'image') {
      return (
        <img
          alt='timeline-img'
          src={value}
          style={{ width: '490px', height: '330px', objectFit: 'cover' }}
        />
      )
    } else if (filterTagType(value) === 'video') {
      return (
        <div style={{lineHeight: '340px'}}>
          <video controls title='timeline-video' 
            src={value}
            style={{width: '480px', verticalAlign: 'middle'}}>
            지원되지 않는 형식입니다.
          </video>
        </div>
      )
    } else if (filterTagType(value) === 'audio') {
      return (
        <div style={{padding: '0px 40px', lineHeight: '340px'}}>
          <audio controls src={value} style={{width: '400px', verticalAlign: 'middle'}}>
          지원되지 않는 형식입니다.
          </audio>
        </div>
      )
    } else {
      return (
        <span style={{lineHeight: '340px', display: 'block', height: '100%', textAlign: 'center'}}>
          지원되지 않는 형식입니다.
        </span>
      )
    }
  }

  const timelineMediaList = () => {
    try {
      if (mediaList.length < 2) {
        return timelineMediaType(data.mediaFK.mediaFirstPath);
      } else {
        return (
          <>
            <div
              style={{
                transition: 'transform 363.693ms cubic-bezier(0.215, 0.61, 0.355, 1) 0s',
                transform: `translateX(${-500 * pictureCount}px)`,
                position: 'relative',
              }}
            >
              <ul style={{ height: '100%', position: 'relative' }}>
                {mediaList.map((value, index) => {
                  return (
                    <li
                      key={`${data.postCd}-${index}`}
                      style={{ position: 'absolute', transform: `translateX(${500 * index}px)`, width: '100%', lineHeight: '340px' }}
                    >
                    {timelineMediaType(value)}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '157.5px',
                height: '25px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                paddingRight: '15px',
                paddingLeft: '10px',
              }}
            >
              {pictureCount === 0 ? (
                <div />
              ) : (
                <div
                  style={{
                    width: '25px',
                    height: '25px',
                    backgroundColor: 'rgba(253,253,253,.7)',
                    borderRadius: '50%',
                    marginLeft: '5px',
                  }}
                  onClick={() => setPictureCount(pictureCount - 1)}
                >
                  <KeyboardArrowLeftIcon />
                </div>
              )}
              {pictureCount >= mediaList.length - 1 ? (
                <div />
              ) : (
                <div
                  style={{
                    width: '25px',
                    height: '25px',
                    backgroundColor: 'rgba(253,253,253,.7)',
                    borderRadius: '50%',
                    marginRight: '5px',
                  }}
                  onClick={() => setPictureCount(pictureCount + 1)}
                >
                  <KeyboardArrowRightIcon />
                </div>
              )}
            </div>
            <div
              style={{
                bottom: '15px',
                left: '50%',
                position: 'absolute',
                right: '6px',
                display: 'flex',
                justifyContent: 'cfr',
                alignItems: 'center',
              }}
            >
              {mediaList.map((value, index) => {
                if (index === pictureCount) {
                  return (
                    <div
                      key={`post-bottom-${data.postCd}-${index}`}
                      className='timeline-media-bottom'
                      style={{
                        opacity: '1',
                      }}
                    />
                  );
                }
                return (
                  <div
                    key={`post-bottom-${data.postCd}-${index}`}
                    className='timeline-media-bottom'
                    style={{
                      opacity: '.4',
                    }}
                  />
                );
              })}
            </div>
          </>
        );
        //165 160 10
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='timeline' style={data.groupFK !== null ? { borderTop: '4px solid tomato' } : null}>
      <div className='timeline-profile'>
        <div className='profile-picture'>
          {data.groupFK === null ? (
            <img alt={`${data.userFK.userId} img`} src={data.userFK.userPic} />
          ) : (
            <img alt={`${data.groupFK.groupCd} img`} src={data.groupFK.groupPic} />
          )}
        </div>
        {data.groupFK === null ? (
          <div className='profile-name'>
            <Link to={`/${data.userFK.userId}`}>
              {data.userFK.userId}({data.userFK.userNm}){' '}
            </Link>
          </div>
        ) : (
          <div className='profile-name'>
            <Link to={`group/${data.groupFK.groupCd}`}>
              {data.groupFK.groupNm}
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', color: 'gray', fontSize: '12px' }}>
              <div>from.</div>
              <div className='group-post-user' style={{ marginLeft: '10px', marginTop: '2px' }}>
                <img alt={`${data.userFK.userId}`} src={data.userFK.userPic} />
              </div>
              <div style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                <Link to={`/${data.userFK.userId}`} style={{color: 'gray'}}>
                  {data.userFK.userId}({data.userFK.userNm})
                </Link>
              </div>
            </div>
          </div>
        )}
        {data.scheduleFK === null ? (
          <div />
        ) : (
          <div className='timeline-showSchedule' onClick={() => setClickSchedule(true)}>
            <TodayIcon style={{ fontSize: '40px' }} />
          </div>
        )}
        <div className='profile-time'>
          <div className='profile-time-text'>
            {Math.abs(dateFns.differenceInDays(Date.parse(data.modifiedDate), new Date())) === 0
              ? '오늘'
              : `${Math.abs(dateFns.differenceInDays(Date.parse(data.modifiedDate), new Date()))}일 전`}
          </div>
        </div>
        <div className='profile-moreIcon'>
          {props.user !== undefined ? (
            props.user.userCd === data.userFK.userCd ? (
              <LongMenu options={['나에게 공유', ' 수정 ', ' 삭제 ']} returnValue={userPostMoreButtonClick} />
            ) : data.postPublicState === 0 ? (
              <LongMenu options={['나에게 공유']} returnValue={userPostMoreButtonClick} />
            ) : null
          ) : null}
        </div>
      </div>
      <div className='timeline-info'>
        <div className='time-line-picture-info'>
          <div className='timeline-media'>
            {timelineMediaList()}
            <div
              className='transition-all'
              style={
                !clickSchedule
                  ? {
                      position: 'absolute',
                      bottom: '0',
                      height: 0,
                      width: '100%',
                      backgroundColor: 'rgb(253,253,253)',
                    }
                  : {
                      position: 'absolute',
                      bottom: '0',
                      width: '98%',
                      height: '100%',
                      zIndex: '1',
                      backgroundColor: 'rgb(253,253,253)',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '5px 5px',
                      borderTop: `3px solid ${data.scheduleFK.scheduleCol}`,
                    }
              }
            >
              {!clickSchedule ? null : (
                <>
                  <div
                    style={{
                      flex: 1,
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      borderBottom: '1px solid rgb(229, 229, 229)',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ paddingLeft: '8px' }}>{data.scheduleFK.scheduleNm}</div>
                    <div style={{ paddingRight: '8px', display: 'flex' }} className='Close-hover'>
                      <CloseIcon onClick={() => setClickSchedule(false)} />
                    </div>
                  </div>
                  <div style={{ flex: 3, height: '150px', display: 'flex', paddingTop: '8px' }}>
                    {data.scheduleFK.scheduleEx}
                  </div>
                  <div style={{ flex: 2 }}>
                    <div
                      style={{
                        height: '50%',
                        display: 'flex',
                        fontSize: '15px',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgb(229, 229, 229)',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontWeight: 'bold' }}>시작</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {dateFns.format(Date.parse(data.scheduleFK.scheduleStr), 'yyyy.M.d EEE h:mm a')}
                      </span>
                    </div>
                    <div
                      style={{
                        height: '50%',
                        display: 'flex',
                        fontSize: '15px',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgb(229, 229, 229)',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontWeight: 'bold' }}>종료</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {dateFns.format(Date.parse(data.scheduleFK.scheduleStr), 'yyyy.M.d EEE h:mm a')}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      marginTop: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
                      <span>함께하는 친구</span>
                    </div>
                    {data.scheduleFK.scheduleMemberList < 1 ? (
                      <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
                        <span>함께하는 친구가 없습니다.</span>
                      </div>
                    ) : (
                      <div>
                        <AvatarGroup>
                          {data.scheduleFK.scheduleMemberList.map((value, index) => (
                            <Avatar
                              key={`${value.userCd}-${index}`}
                              alt={`${value.userCd}-${index}`}
                              src={value.userPic}
                            />
                          ))}
                        </AvatarGroup>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className='timeline-context'>{data.postEx}</div>
        </div>
        <div className='comment-context'>
          <div className='comment-reply' style={{ overflowY: 'auto' }}>
            {data.commentList.length > 0 ? (
              <CommentList
                postCd={data.postCd}
                tData={data.commentList}
                user={props.user}
                onSuccess={(commentInfo) => {
                  console.log(commentInfo);
                  setData({ ...data, commentList: commentInfo });
                }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='recomment-reply-users-img'>
                  <img alt={`${data.userFK.userId}`} src={data.userFK.userPic} />
                </div>
                <div style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                  {data.userFK.userId}({data.userFK.userNm})
                </div>
                <div style={{ marginLeft: '5px' }}>게시물에 첫번째 댓글을 달아주세요</div>
              </div>
            )}
          </div>

          <div className='comment-context-icon'>
            <div className='comment-icon-left'>
              <div className='likeIcon'>
                <ThumbUpRoundedIcon
                  style={data.currentUserLikePost ? { color: 'rgba(20, 81, 51, 0.9)', fontSize: 25 } : { fontSize: 25 }}
                  onClick={async () => {
                    if (props.user === undefined) return;
                    try {
                      if (data.currentUserLikePost === false) {
                        const like = (
                          await axios.post(`/post/${data.postCd}/like`, props.user.userCd, {
                            headers: { 'Content-Type': 'application/json' },
                          })
                        ).data;
                        if (like) {
                          // store.dispatch({
                          //   type: 'SAVE_NOTICE',
                          //   notice: {
                          //     noticeType: 'POST_LIKE_NEW', // 이벤트 타입
                          //     activeCd: props.user.userCd, // 이벤트 주체
                          //     targetCd: data.postCd, // 이벤트 대상
                          //   },
                          // });
                          setData({
                            ...data,
                            currentUserLikePost: true,
                            postLikeCount: data.postLikeCount + 1,
                            postLikeFirstUser: data.postLikeFirstUser === null ? props.user : data.postLikeFirstUser,
                          });
                        }
                      } else {
                        const unLike = (
                          await axios.delete(`/post/${data.postCd}/unLike`, { params: { userCd: props.user.userCd } })
                        ).data;
                        setData({
                          ...data,
                          currentUserLikePost: false,
                          postLikeCount: data.postLikeCount - 1,
                          postLikeFirstUser:
                            (await axios.get(`/post/${data.postCd}`)).data.postLikeFirstUser,
                            // data.postLikeFirstUser.userCd === props.user.userCd ? null : data.postLikeForstUser,
                            // data.postLikeFirstUser.userCd === props.user.userCd ? 다음 사람의 데이터...ㅠ : data.postLikeForstUser,
                        });
                      }
                    } catch (e) {
                      console.log(e);
                      setDialog(
                        <AlertDialog severity='error' content='서버에러' onAlertClose={() => setDialog(null)} />
                      );
                    }
                  }}
                />
              </div>
              {data.postLikeCount < 1 ? (
                <div className='.comment-title-none'>첫번째 좋아요를 눌러주세요</div>
              ) : data.postLikeCount === 1 ? (
                <div
                  className='comment-title'
                  onClick={() => setLikePersonList(true)}
                >{`${data.postLikeFirstUser.userId}(${data.postLikeFirstUser.userNm}) 님이 좋아합니다`}</div>
              ) : (
                <div className='comment-title' onClick={() => setLikePersonList(true)}>{`${
                  data.postLikeFirstUser.userId
                }(${data.postLikeFirstUser.userNm}) 님 외 ${data.postLikeCount - 1}명이 좋아합니다`}</div>
              )}
            </div>
          </div>
          <div className='comment-write'>
            <CommentTimeline
              user={props.user}
              postCd={data.postCd}
              onSuccess={(commentInfo) => {
                setData({
                  ...data,
                  commentList: data.commentList.concat(commentInfo),
                });
              }}
            />
          </div>
        </div>
      </div>
      {likePersonList ? <LikePersonList postCd={data.postCd} onCancel={() => setLikePersonList(false)} /> : null}
      {menuDialog}
      {dialog}
    </div>
  );
};

const SendButton = styled(Button)({
  minWidth: '20px',
  height: '20px',
});

export default Timeline;

import React, { useState, useEffect, useRef } from 'react';
import * as dateFns from 'date-fns';
import { styled } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import AlertDialog from '../Other/AlertDialog';

import './Timeline.css';
import LikePersonList from './LikePersonList';
import CommentList from './CommentList';
import LongMenu from '../Other/MoreMenu';
import Timeline from './Timeline';
import TimelineWeekSchedule from './TimelineWeekSchedule';
import PostShare from '../../Containers/Profile/PostShare';
import EditPostMediaSchedule from '../../Containers/Profile/EditPostMediaSchedule';
import SmsIcon from '@material-ui/icons/Sms';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
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
  extensionVideo.map((value) => {
    if (extension === value) filterType = 'video';
  });
  extensionAudio.map((value) => {
    if (extension === value) filterType = 'audio';
  });
  return filterType;
};

const timelineMediaType = (value, index) => {
  if (filterTagType(value) === 'image') {
    return (
      <img
        id={`postshareMedia-${index}`}
        alt={`postshareMedia-${index}`}
        src={value}
        style={{
          boxShadow: '0px 1px 3px rgba(161, 159, 159, 0.6)',
          width: '60px',
          height: '60px',
          objectFit: 'cover',
        }}
      />
    );
  } else if (filterTagType(value) === 'video') {
    return (
      <video
        controls
        title={`postshareMedia-${index}`}
        src={value}
        style={{ boxShadow: '0px 1px 3px rgba(161, 159, 159, 0.6)', height: '60px', objectFit: 'cover' }}
      >
        지원되지 않는 형식입니다.
      </video>
    );
  } else if (filterTagType(value) === 'audio') {
    return (
      <audio controls src={value} style={{ width: '60px' }}>
        지원되지 않는 형식입니다.
      </audio>
    );
  } else {
    return <span style={{ display: 'block', height: '100%', textAlign: 'center' }}>지원되지 않는 형식입니다.</span>;
  }
};

const PostShareTimeline = (props) => {
  const classes = useStyles();
  const [dialog, setDialog] = useState(null);
  const [data, setData] = useState(props.data);
  const [postOriginData, setPostOriginData] = useState(props.data.postOriginFK);
  const [menuDialog, setMenuDialog] = useState(null);
  const [pictureCount, setPictureCount] = useState(0);
  const [mediaList, setMediaList] = useState([]);
  const [timelineRender, setTimelineRender] = useState(false);
  const [likePersonList, setLikePersonList] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (postOriginData.mediaFK !== null) {
          const mediaSrc = (await axios.get(`/media/${postOriginData.mediaFK.mediaCd}`)).data;
          if (mediaSrc.length < 0) {
            return;
          } else {
            setMediaList(mediaList.concat(JSON.parse(JSON.stringify(mediaSrc))));
          }
        } else return;
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const userPostMoreButtonClick = (selectedValue, value) => {
    switch (selectedValue) {
      // case '공유 게시물':
      //   setMenuDialog(
      //     <Dialog open onClose={() => setMenuDialog(null)}>
      //       <Timeline data={postOriginData} user={props.user} />
      //     </Dialog>
      //   );
      //   break;
      case '수정':
        // 게시물 EX만 수정할 수 있도록 만들기
        // 따로 ex 디자인 추가하여 수정하기
        setMenuDialog(<EditPostMediaSchedule mediaList={[]} data={data} onCancel={() => setMenuDialog(null)} />);
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
            <Link to={`group/${data.groupFK.groupCd}`}>{data.groupFK.groupNm}</Link>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', color: 'gray', fontSize: '12px' }}>
              <div>from.</div>
              <div className='group-post-user' style={{ marginLeft: '10px', marginTop: '2px' }}>
                <img alt={`${data.userFK.userId}`} src={data.userFK.userPic} />
              </div>
              <div style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                <Link to={`/${data.userFK.userId}`} style={{ color: 'gray' }}>
                  {data.userFK.userId}({data.userFK.userNm})
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className='profile-time'>
          <div className='profile-time-text'>
            {Math.abs(dateFns.differenceInDays(Date.parse(data.modifiedDate), new Date())) === 0
              ? '오늘'
              : `${Math.abs(dateFns.differenceInDays(Date.parse(data.modifiedDate), new Date()))}일 전`}
          </div>
        </div>
        {props.user !== undefined ? (
          props.user.userCd !== data.userFK.userCd ? null : (
            <div className='profile-moreIcon'>
              <LongMenu options={[' 수정 ', ' 삭제 ']} returnValue={userPostMoreButtonClick} />
            </div>
          )
        ) : null}
      </div>
      <div className='timeline-info'>
        <div className='time-line-picture-info'>
          <div
            className='timeline-shareForm'
            onClick={() => {
              if (postOriginData.mediaFK !== null) {
                return setMenuDialog(
                  <Dialog open onClose={() => setMenuDialog(null)}>
                    <Timeline data={postOriginData} user={props.user} />
                  </Dialog>
                );
              } else if (postOriginData.scheduleFK !== null || postOriginData.shareScheduleList.length > 0) {
                return setMenuDialog(
                  <Dialog open onClose={() => setMenuDialog(null)}>
                    <TimelineWeekSchedule data={postOriginData} user={props.user} />
                  </Dialog>
                );
              } else return null;
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div className='timeline-share-userInfo'>
                <img alt={`${postOriginData.userFK.userId}-img`} src={postOriginData.userFK.userPic} />
                <div>
                  {postOriginData.userFK.userId}({postOriginData.userFK.userNm})
                </div>
              </div>
            </div>

            {postOriginData.scheduleFK === null ? null : (
              <div style={{ display: 'flex', padding: '8px 0px', borderTop: '1px solid rgb(229, 229, 229)' }}>
                {postOriginData.scheduleFK.scheduleNm}
              </div>
            )}
            <div
              style={{
                flex: 6,
                display: 'flex',
                flexDirection: 'column',
                padding: '8px 0px',
                borderTop: '1px solid rgb(229, 229, 229)',
                overflowY: 'auto',
              }}
            >
              {postOriginData.scheduleFK === null ? (
                postOriginData.shareScheduleList.length <= 0 ? null : (
                  <div
                    style={{
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '11pt',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontWeight: 'bold', display: 'contents' }}>
                      {dateFns.format(Date.parse(postOriginData.shareScheduleStartDate), 'yyyy.M.d')}
                    </span>
                    부터&nbsp;
                    <span style={{ fontWeight: 'bold', display: 'contents' }}>
                      {dateFns.format(Date.parse(postOriginData.shareScheduleEndDate), 'yyyy.M.d')}
                    </span>
                    까지
                    <br />
                    <span style={{ fontWeight: 'bold', display: 'contents' }}>
                      {postOriginData.shareScheduleList.length}
                    </span>
                    개의 일정을 확인하려면 클릭하세요.
                  </div>
                )
              ) : (
                <span style={{ paddingBottom: '8px' }}>{postOriginData.scheduleFK.scheduleEx}</span>
              )}
              <div style={{ display: 'flex', overflowX: 'auto' }}>
                {mediaList.length > 0
                  ? mediaList.map((value, index) => (
                      <div style={{ marginRight: '10px' }} key={`${index}-postAddMedia`}>
                        {timelineMediaType(value, index)}
                      </div>
                    ))
                  : null}
              </div>
              <div style={{ paddingTop: '8px', color: '#999' }}>
                {postOriginData.postEx === null ? null : <span>{postOriginData.postEx}</span>}
              </div>
            </div>

            {postOriginData.scheduleFK === null ? null : (
              <div style={{ flex: 2 }}>
                <div
                  style={{
                    height: '50%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgb(229, 229, 229)',
                    alignItems: 'center',
                    padding: '8px 0px',
                  }}
                >
                  <span>시작</span>
                  <span>
                    {dateFns.format(Date.parse(postOriginData.scheduleFK.scheduleStr), 'yyyy.M.d EEE h:mm a')}
                  </span>
                </div>
                <div
                  style={{
                    height: '50%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgb(229, 229, 229)',
                    alignItems: 'center',
                    padding: '8px 0px',
                  }}
                >
                  <span>종료</span>
                  <span>
                    {dateFns.format(Date.parse(postOriginData.scheduleFK.scheduleStr), 'yyyy.M.d EEE h:mm a')}
                  </span>
                </div>
              </div>
            )}

            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                borderTop: '1px solid rgb(229, 229, 229)',
              }}
            >
              <div style={{ margin: '8px 10px', display: 'flex', alignItems: 'center' }}>
                <ThumbUpRoundedIcon style={{ fontSize: '20' }} />
                <div style={{ marginLeft: '3px' }}>{postOriginData.postLikeCount}</div>
              </div>
              <div style={{ margin: '8px 0px', display: 'flex', alignItems: 'center' }}>
                <SmsIcon style={{ fontSize: '20' }} />
                <div style={{ marginLeft: '3px' }}>{postOriginData.commentList.length}</div>
              </div>
            </div>
          </div>
          <div className='timeline-context'>
            <div style={{ margin: '5px' }}>{data.postEx}</div>
          </div>
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
                  setData(
                    commentInfo.map((value) => ({
                      ...data,
                      commentList: value,
                    }))
                  );
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
                      } else {
                        const unLike = (
                          await axios.delete(`/post/${data.postCd}/unLike`, { params: { userCd: props.user.userCd } })
                        ).data;
                        setData({
                          ...data,
                          currentUserLikePost: false,
                          postLikeCount: data.postLikeCount - 1,
                          postLikeFirstUser: (await axios.get(`/post/${data.postCd}`)).data.postLikeFirstUser,
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
                <div className='comment-title-none'>첫번째 좋아요를 눌러주세요</div>
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

export default PostShareTimeline;

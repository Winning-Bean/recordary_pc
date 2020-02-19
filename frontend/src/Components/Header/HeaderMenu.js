import React, { useState } from 'react';
import './header.css';
import UserEditor from './UserEditor';
import GroupAdd from 'Containers/Group/GroupAdd';
import LongMenu from '../Other/MoreMenu';
import ProfileEditor from 'Components/Profile/ProfileEditor';
import GroupSetting from 'Components/Group/GroupSetting';

import { styled } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowDown from '@material-ui/icons/KeyboardArrowDown';
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';

const HeaderMenu = (props) => {
    const data = props.data;
    const [profileEditForm, setProfileEditForm] = useState(null);
    const [editor, setEditor] = useState(null);
    const [open, setOpen] = useState({
        group: false,
        friend: false,
    });
    const [groupAdd, setGroupAdd] = useState(null);
    const [menuDialog, setMenuDialog] = useState(null);



    const showOpen = (isGroup) => {
        if (isGroup) {
            setOpen({ ...open, group: !open.group });
            return;
        }
        setOpen({ ...open, friend: !open.friend });
        return;
    };

    const onGroupMenuSelect = (selectedValue, code) => {
        const value = data.userGroup.filter((value)=>value.group_cd === code)[0];
        // 그룹목록에서 현재 선택된 그룹 객체를 찾음
        switch (selectedValue) {
            case '그룹 정보':
                break;
            case '그룹 관리':
                setMenuDialog(<GroupSetting data={value} onClose={() => setMenuDialog(null)} />);
                break;
            case '그룹 삭제':
                break;
        }
    }

    const showGroupAdd = () => {
        if (groupAdd === null) {
            setGroupAdd(<GroupAdd onCancel={()=>setGroupAdd(null)} />)
            return;
        }
        setGroupAdd(null);
        return;
    }

    const ShowProfileEditForm = () => {
        if (profileEditForm === null) {
            setProfileEditForm(<ProfileEditor onCancel={()=>setProfileEditForm(null)} />)
            return;
        }
        setProfileEditForm(null)
        return;
    }

    const GroupList = (() => {
        if (open.group === true) {
            const gruops = data.userGroup.map(
                (value) => {
                    return (
                        <li key={value.group_cd}>
                            <div className="button-wrap">
                                <GroupButton>
                                    <div style={{ display: 'flex', width: '250px', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                            <img alt="group-img" style={{ marginRight: '10px', borderRadius: '50%' }} src={value.group_pic} />
                                            {value.group_nm}
                                        </div>
                                        {/* <div className="LongMenuOpen">
                                        <LongMenu
                                            options={['그룹 정보', '그룹 관리', '그룹 삭제']}
                                            code={value.group_cd}
                                            returnValue={onGroupMenuSelect}
                                        />
                                    </div> */}
                                    </div>
                                </GroupButton>
                                <div className="LongMenuOpen">
                                    <LongMenu
                                        options={['그룹 정보', '그룹 관리', '그룹 삭제']}
                                        code={value.group_cd}
                                        returnValue={onGroupMenuSelect}
                                    />
                                </div>
                            </div>
                        </li>)
                }
            );
            return (
                <div className="button-wrap">
                    <GroupButton style={{ backgroundColor: 'rgba(209, 204, 192,0.4)' }} onClick={() => showOpen(true)}>
                        <div>
                            <span style={{ fontSize: '18px', paddingTop: '5px' }}>Groups</span>
                        </div>
                        <span><ArrowUp style={{ fontSize: '30px' }} /></span>
                    </GroupButton>
                    <div style={{ position: 'absolute', top: '4px', left: '85px' }}>
                        <IconButton onClick={showGroupAdd}><AddIcon style={{ fontSize: '20px' }} /></IconButton>
                    </div>
                    <div><ul>{gruops}</ul></div>
                </div>
            );
        }
        return (<div className="button-wrap">
            <GroupButton onClick={() => showOpen(true)}>
                <div>
                    <span style={{ fontSize: '18px', paddingTop: '5px' }}>Groups</span>
                </div>
                <span><ArrowDown style={{ fontSize: '30px' }} /></span>
            </GroupButton>
            <div style={{ position: 'absolute', top: '4px', left: '85px' }}>
                <IconButton onClick={showGroupAdd}><AddIcon style={{ fontSize: '20px' }} /></IconButton>
            </div>
        </div>);
    })();
    const friendList = (() => {
        if (open.friend === true) {
            const friends = data.userFriend.map(
                (value) => {
                    return (
                        <li key={value.friend_cd}>
                            <GroupButton>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    <img alt="friend-img" style={{ marginRight: '10px', borderRadius: '50%' }} src={value.friend_pic} />
                                    {value.friend_nm}
                                </div>
                            </GroupButton>
                            <div>
                                <CustomIconButton><MoreVertIcon /></CustomIconButton>
                            </div>
                        </li>)
                }
            );
            return (
                <div className="gruop-field">
                    <GroupButton style={{ backgroundColor: 'rgba(209, 204, 192,0.4)' }} onClick={() => showOpen(false)}>
                        <div>
                            <span style={{ fontSize: '18px', paddingTop: '5px' }}>Friends</span>
                        </div>
                        <span><ArrowUp style={{ fontSize: '30px' }} /></span>
                    </GroupButton>
                    <div><ul>{friends}</ul></div>
                </div>
            );
        }
        return <GroupButton onClick={() => showOpen(false)}>
            <div>
                <span style={{ fontSize: '18px', paddingTop: '5px' }}>Friends</span>
            </div>
            <span><ArrowDown style={{ fontSize: '30px' }} /></span>
        </GroupButton>;
    })();
    const showEditor = () => {
        if (editor === null) {
            setEditor(<UserEditor currentUser={data.currentUser} onCancel={()=>setEditor(null)} />)
            return;
        }
        setEditor(null);
        return;
    }

    return (
        <Drawer
            open={props.open}
            onClose={() => props.onClose()}
            style={{ backgroundColor: 'rgba(241, 242, 246,0.1)' }}
            anchor='left'>
            <div className="menu-wrap">
                <div className="menu-profile">
                    <div className="menu-profile-pic-nm">
                        <div style={{ marginRight: '10px' }}>
                            <img alt="user img" src="http://placehold.it/40x40"
                                style={{ borderRadius: '50%' }}
                            />
                        </div>
                        <span>{data.currentUser.user_id}</span>
                    </div>
                    <div className="profile-edit-icon">
                        <CustomIconButton onClick={ShowProfileEditForm}><EditIcon /></CustomIconButton>
                    </div>
                    {profileEditForm}
                </div>
                <div className="menu-buttons">
                    {GroupList}
                    {friendList}
                </div>
                <div className="menu-bottom">
                    <CustomIconButton onClick={showEditor}><SettingsIcon /></CustomIconButton>
                    <CustomIconButton>로그아웃</CustomIconButton>
                </div>
                {editor}
                {groupAdd}
                {menuDialog}
            </div>
        </Drawer>
    )
}


const CustomIconButton = styled(Button)({
    minWidth: '40px',
    height: '40px',
});
const GroupButton = styled(Button)({
    width: '250px',
    height: '50px',
    borderBottom: '1px solid rgba(209, 204, 192,0.8)',
    borderRadius: '0',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingLeft: '10px',
});

export default React.memo(
    HeaderMenu,
    (props, newProps) => {
        console.log(props, newProps);
        return props === newProps
        // false 일시 랜더링
        // true 일시 비랜더링
    });
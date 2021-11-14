import { Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, Divider } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import PageContainer from '../../components/PageContainer';
import ChatView from './ChatView';
import moment from 'moment'
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import userApi from '../../redux/api/user';
import { fetchUsers } from '../../redux/actions/general'
import firebase from '../../redux/api/config'

const Messages = ({ general, user, fetchUsers }) => {
    const history = useHistory()
    const [ activeChat, setActiveChat] = useState({})
    const [ chats, setChats] = useState(user?.chatList || [])
    const [ users, setUsers] = useState(general?.users || [])
    const [ userData, setUserData] = useState(user?.userData || {})
    const [ processing, setProcessing ] = useState(false)
    const isTab = useMediaQuery({ query: '(max-width: 990px)' })

    useEffect(() => {
        const email = history?.location?.pathname?.split('messages/')?.[1] || ''
        if(email) {
            checkChat(email)
        } else {
            setActiveChat({})
        }
    }, [history])

    const checkChat = async (email) => {
        try {
            const usr = await userApi.getUserData(email)
            const existingChat = chats.find(({ participants = [] }) => participants.indexOf(email) > -1)
            if(Boolean(existingChat)) setActiveChat({ ...existingChat, participant: usr.data(), user: user.userData.email, })
            else {
                const newChat = {
                    participants: [ user?.userData?.email, email ],
                    started: Date.now(),
                    user: user.userData.email,
                    participant: usr.data()
                }
                setActiveChat(newChat);
                setChats([ ...chats, newChat ])
            }
        } finally {

        }
    }

    const truncate = (string) => {
        return (string.length > 35) ? `${string.substring(0, 35)}...` : string
    }

    useEffect(() => {
        if(activeChat?.participants) {
            const activeC = chats.find((chat) => chat?.participant?.email === activeChat?.participant?.email)
            if(activeC) {
                setActiveChat(activeC)
            }
        }
    }, [chats])

    const getChats = async (email = '') => {
        try {
            setProcessing(true)
            firebase.firestore().collection(`chats`).where('participants', 'array-contains', email).onSnapshot(snapShot => {
                const chats = snapShot.docChanges().map((snap) => {
                    const data = snap.doc.data()
                    const part = data.participants.find((eml) => eml !== email)
                    const usr = users.find(({ email }) => email === part ) 
                    return { ...data, chatId: snap.doc.id, participant: usr }
                });
                setChats(chats)
            });
        }
        catch(err) {
            console.log(err)
        }
        finally {
            setProcessing(false)
        }
    }

    useEffect(() => {
        getChats(userData?.email);
    }, [userData, users])

    useEffect(() => {
        setUserData(user?.userData || {});
    }, [user.userData])

    useEffect(() => {
        setUsers(general?.users || []);
    }, [general.users])

    return (
        <PageContainer logo="dark" processing={Boolean(users.length === 0 || processing)}>
            <Grid container>
                { ( !isTab || !activeChat?.participants) && <Grid item xs={isTab ? 12 : 4} className="MuiAppBar-positionSticky" style={{ top: '120px' }}>
                    <List className="chats">
                        {
                            chats.map(({ participant, ...chat }, key) => (
                                <div  key={key}>
                                    <ListItem button onClick={() => setActiveChat({ ...chat, participant })}>
                                        <ListItemAvatar>
                                            <Avatar src={participant?.image} />
                                        </ListItemAvatar>
                                        {/* <ListItemText primary={user.name} secondary={truncate(messages[messages.length - 1]?.message)} /> */}
                                        <ListItemText primary={participant?.lastName + ' ' + participant?.firstName}  />

                                        {/* <ListItemSecondaryAction>
                                            <ListItemText className="chat-time" primary={moment(messages[messages.length - 1]?.date).startOf('day').fromNow()} />
                                        </ListItemSecondaryAction> */}
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))
                        }
                    </List>
                </Grid>
                }
                { <Grid item xs={12} lg={8} className="MuiAppBar-positionSticky" style={{ top: '120px' }}>
                    <ChatView chat={activeChat} user={userData?.email} setActiveChat={setActiveChat}/>
                </Grid> }
            </Grid>
            
        </PageContainer>
    )
}
const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchUsers }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Messages)

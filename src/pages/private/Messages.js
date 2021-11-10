import { Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, Divider } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import PageContainer from '../../components/PageContainer';
import ChatView from './ChatView';
import moment from 'moment'
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchChats } from '../../redux/actions/user';
import { bindActionCreators } from 'redux';
import userApi from '../../redux/api/user';

const Messages = ({ general, user, fetchChats }) => {
    const history = useHistory()
    const [ activeChat, setActiveChat] = useState({})
    const [ chats, setChats] = useState(user?.chatList || [])
    const [ processing, setProcessing ] = useState(false)
    const isTab = useMediaQuery({ query: '(max-width: 990px)' })

    useEffect(() => {
        const email = history?.location?.pathname?.split('messages/')?.[1] || ''
        if(email) {
            checkChat(email)
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

    const setChatList = async () => {
        setChats(user.chatList.map(async (chat) => {
            let part = chat.participants.find((email) => email !== user.userData.email)
            const usr = await userApi.getUserData(part);
            return { ...chat, participant: usr.data() }

        }))

    }

    useEffect(() => {
        if(activeChat?.participants) {
            let part = activeChat.participants.find((email) => email !== user.userData.email)
            let actChat = chats.find((chat) => console.log(chat));
            setActiveChat(actChat)
            // chat.participants.indexOf(part) > -1
        }
    }, [chats])

    useEffect(() => {
        setChatList(user.chatList);
    }, [user.chatList])

    return (
        <PageContainer logo="dark" processing={processing}>
            <Grid container>
                <Grid item xs={isTab ? 12 : 4}>
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
                { !isTab && <Grid item sm={12} md={8}>
                    <ChatView chat={activeChat} />
                </Grid> }
            </Grid>
            
        </PageContainer>
    )
}
const mapStateToProps = ({ general, user }) => ({ general, user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchChats }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Messages)

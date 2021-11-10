import { IconButton, List, ListItem, ListItemText, TextField, FormControl, Avatar, ListItemAvatar, Divider } from '@material-ui/core';
import { Info, Send } from '@material-ui/icons';
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import PerfectScrollbar from 'react-perfect-scrollbar'
import userApi from '../../redux/api/user';

const ChatView = ({ chat }) => {
    const [ currentChat, setCurrentChat ] = useState(chat)
    const [ message, setMessage ] = useState('')

    useEffect(() => {
        setCurrentChat(chat)
    }, [chat])

    const getClassName = (id) => {
        return id === '123321' ? 'message right' : 'message left'
    }

    const sendMessage = async () => {
        if(message) {
            try {
                const msg = {
                    message,
                    from: currentChat.user,
                }
                const key = Date.now();
                const { participant, participants, user, started, lastMessage, ...messages } = currentChat

                if(Object.keys(messages).length > 0) {
                    await userApi.newMessage({ [key]: msg, id: currentChat.id, lastMessage: currentChat.user });
                    setMessage('')
                } else {
                    await userApi.addMessage({ [key]: msg, participants, started, lastMessage: currentChat.user }).then((doc) => {
                        setCurrentChat({ ...currentChat, id: doc.id});
                        setMessage('')
                    });
                }
            }
            catch {

            }
        }
    }

    return (
        <div style={{ borderLeft: '2px solid #ddd', paddingLeft: '1rem' }}>
            {
                Boolean(currentChat?.participants) ?
                <>
                    <List>
                        <ListItem>
                            <ListItemAvatar><Avatar src={currentChat?.participant?.image} /></ListItemAvatar>
                            <ListItemText primary={currentChat?.participant?.lastName + ' ' + currentChat?.participant?.firstName} primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
                        </ListItem>
                    </List>
                    <Divider />
                    <PerfectScrollbar style={{ paddingBottom: '10px' }}>
                        <List className="message-list">
                            {
                                currentChat?.messages && currentChat?.messages.map(({ date, message, userId }, key) => (
                                    <ListItem key={key} className={getClassName(userId)}>
                                        <ListItemText primary={message} secondary={moment(date).startOf('hour').fromNow()} />
                                    </ListItem>
                                ))
                            }
                        </List>
                    </PerfectScrollbar>
                    <form className="chat-control" onSubmit={(e) =>{ e.preventDefault(); sendMessage() }}>
                        <TextField value={message} onChange={(e) => setMessage(e.target.value)} variant="outlined" fullWidth
                            placeholder="Type message here..."
                        />
                        <IconButton type="submit">
                            <Send />
                        </IconButton>
                    </form>
                </>
                :
                <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Info style={{ fontSize: '120px' }} />
                    <p>Click on any chat to start a conversation</p>
                </div>
            }
        </div>
    )
}

export default ChatView

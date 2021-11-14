import { IconButton, List, ListItem, ListItemText, TextField, Avatar, ListItemAvatar, Divider, ListItemIcon } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { Info, Send } from '@material-ui/icons';
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import PerfectScrollbar from 'react-perfect-scrollbar'
import userApi from '../../redux/api/user';
import { useMediaQuery } from 'react-responsive';

const ChatView = ({ chat, user = '', setActiveChat }) => {
    const [ currentChat, setCurrentChat ] = useState(chat)
    const [ message, setMessage ] = useState('')
    const [ messages, setMessages ] = useState([])
    const isTab = useMediaQuery({ query: '(max-width: 990px)' })

    useEffect(() => {
        setCurrentChat(chat)
        getMessages(chat);
    }, [chat])

    const getMessages = (chat) => {
        const mgs = Object.keys(chat).filter((key) => key > 0);
        setMessages(mgs || [])
    }

    const sendMessage = async () => {
        if(message && user) {
            try {
                const msg = {
                    message,
                    from: user,
                }
                const key = Date.now();
                console.log(key)
                const { participant, participants, started, lastMessage, chatId, ...others } = currentChat

                if(messages.length > 0) {
                    console.log(chatId, moment(key).format('DD MMM, YYYY'))
                    await userApi.newMessage({ [key]: msg, id: chatId, lastMessage: user });
                    setMessage('')
                } else {
                    await userApi.newChat({ [key]: msg, participants, started, lastMessage: user }).then((doc) => {
                        setCurrentChat({ ...currentChat, id: doc.id});
                        setMessage('')
                    });
                }
            }
            catch(err) {
                console.log(err)
            }
        }
    }

    return (
        <div style={{ borderLeft: isTab ? 0 : '2px solid #ddd', paddingLeft: isTab ? 0 : '1rem' }}>
            {
                Boolean(currentChat?.participants) ?
                <>
                    <List>
                        <ListItem>
                            {
                                isTab &&
                                <ListItemIcon onClick={() => setActiveChat({})}>
                                    <ArrowBack />
                                </ListItemIcon>
                            }
                            <ListItemAvatar><Avatar src={currentChat?.participant?.image} /></ListItemAvatar>
                            <ListItemText primary={currentChat?.participant?.lastName + ' ' + currentChat?.participant?.firstName} primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
                        </ListItem>
                    </List>
                    <Divider />
                    <PerfectScrollbar style={{ paddingBottom: '10px' }}>
                        <List className="message-list pb-3">
                            {
                                messages?.sort((a,b) => (a > b) ? 1 : -1)?.map((key) => (
                                    <ListItem key={key} className={Boolean(currentChat?.[key]?.from === user) ? 'message right' : 'message left'}>
                                        <ListItemText primary={currentChat?.[key]?.message || ''} secondary={moment(parseInt(key)).startOf('hour').fromNow()} />
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

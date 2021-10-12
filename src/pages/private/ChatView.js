import { IconButton, List, ListItem, ListItemText, TextField, FormControl, Avatar, ListItemAvatar, Divider } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import PerfectScrollbar from 'react-perfect-scrollbar'

const ChatView = ({ chat }) => {
    const [ currentChat, setCurrentChat ] = useState(chat)

    useEffect(() => {
        setCurrentChat(chat)
    }, [chat])

    const getClassName = (id) => {
        return id === '123321' ? 'message right' : 'message left'
    }

    return (
        <div style={{ borderLeft: '2px solid #ddd', paddingLeft: '1rem' }}>
            <List>
                <ListItem>
                    <ListItemAvatar><Avatar> <img src={currentChat?.user?.image} /> </Avatar></ListItemAvatar>
                    <ListItemText primary={currentChat?.user?.name} primaryTypographyProps={{ style: { fontWeight: 'bold' } }} />
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
            <FormControl className="chat-control">
                <TextField variant="outlined" fullWidth
                    placeholder="Type message here..."
                />
                <IconButton>
                    <Send />
                </IconButton>
            </FormControl>
        </div>
    )
}

export default ChatView

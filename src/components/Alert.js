import { Dialog, DialogActions, Button, DialogContent } from '@material-ui/core';
import React, { useState, useEffect } from 'react'

const Alert = ({ open = false, config, setOpenModal }) => {
    const defFunc = () => { setOpenModal(false) }
    const { 
        error =  '', success =  '', header =  '', message =  '', btn1Text =  'Cancel', 
        btn2Text =  '', btn1Action =  defFunc, btn2Action =  defFunc
    } = config;

    return (
        <Dialog open={open} PaperProps={{ style: { padding: '1rem' }}}>
            <DialogContent>
                <h2 style={{ marginBottom: 0 }}>{header}</h2>
                <h4 style={{ marginTop: '5px' }}>{message}</h4>
            </DialogContent>
            <DialogActions>
                { 
                    btn2Text &&
                    <Button variant="outlined" color="primary" className="button" onClick={() => btn2Action()}>
                        {btn2Text}
                    </Button>
                }
                {
                    btn1Text && 
                    <Button variant="contained" color="primary" className="button" onClick={() => btn1Action()}>
                        { btn1Text }
                    </Button>

                }
            </DialogActions>
        </Dialog>
    )
}

export default Alert

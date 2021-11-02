import { Button, CircularProgress, Dialog, DialogActions, DialogContent, Grid, TextField } from '@material-ui/core'
import { CameraAltRounded } from '@material-ui/icons';
import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';
import generalApi from '../redux/api/general';
import userApi from '../redux/api/user';

const AddFeed = ({ open = false, user = null, freeTrial = false, setOpenDialog }) => {
    const [ activePermits, setActivePermits] = useState([])
    const [ processing, setProcessing] = useState(false)
    const [ uploading, setUploading ] = useState(false)
    const [ error, setError ] = useState('')
    const [ form, setForm ] = useState({
        user: user, caption: '', image: ''

    });
    const imageRef = useRef()

    const handleImage = ({ files = [], name }) => {
        if(files.length > 0) {
            handleChange({ name, value: files[0] })
        } else {
            handleChange({ name, value: '' })
        }
    }

    const handleChange = ({name, value}) => {
        setForm({ ...form, [name]: value })

    }

    const init = async () => {
        setForm({
            user: user, caption: '', image: ''
    
        })
        setError('')
        try {
            setProcessing(true)
            const res = await userApi.getActivePermits(user)
            console.log(res)
            setActivePermits(res)
        }
        catch (err) {
            console.log(err)
        } finally {
            setProcessing(false)
        }
    }

    const upload = async () => {
        setError('')
        if(form.caption && form.user && form.image !== '') {
            try {
                setUploading(true)
                const res = await generalApi.addFeed(form);
                alert('Successfully uploaded new feed')
                setOpenDialog(false)
            }
            catch(err) {
                console.log(err)
                setError(err?.message || 'An error occurred')
            }
            finally {
                setUploading(false)
            }
        } else {
            setError('All fields are required')
        }
    }

    useEffect(() => {
        if(open === true) init()
    }, [open])


    return (
        <Dialog open={open}>
            <DialogContent style={{ minWidth: '50%' }}>
                {
                    processing ?
                    <div className="d-flex justify-center">
                        <CircularProgress size={30} /> 
                    </div>
                    :
                    !Boolean(user) ?
                    <>
                        <h3>Kindly Login to continue</h3>
                        <p>Click <Link className="text-primary" to="/login">here</Link> to login or <Link className="text-primary" to="/sign-up">create an account</Link></p>
                    </>
                    :
                    (freeTrial || Boolean(activePermits.find((active) => active?.id == 1))) ?
                    <div>
                        <h3 className="text-center">Upload Content</h3>
                        <input type="file" hidden name="image" ref={imageRef} onChange={(e) => handleImage(e.target)} />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <div onClick={() => imageRef.current.click()}  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100px', height: 'auto', border: '1px solid #093028', cursor: 'pointer' }}>
                                    {
                                        typeof(form.image) === 'string' ?
                                        <CameraAltRounded style={{ margin: '1rem' }} />
                                        :
                                        <img src={URL.createObjectURL(form.image)} style={{ width: '100%', height: 'auto' }} />
                                    }
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="caption" placeholder="Enter caption" fullWidth variant="outlined" multiline minRows={2} value={form.caption}
                                    onChange={(e) => handleChange(e.target)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {
                                    Boolean(error) && <p className="error-text">{error}</p>
                                }
                            </Grid>

                        </Grid>
                    </div>
                    :
                    <>
                        <p>You don't have an active Content Creator Permits</p>
                        <p>Click <Link className="text-primary" to="/account/permits">here</Link> to purchase one</p>
                    </>
                }
            </DialogContent>
            <DialogActions style={{ margin: '0 1rem 1rem 0' }}>
                <Button onClick={() => setOpenDialog(false)} className="btn red" variant="contained" color="primary">Close</Button>
                { (!processing && (freeTrial || Boolean(activePermits.find((active) => active?.id == 1)))) && <Button onClick={() => upload()} className="btn" variant="contained" color="primary">{
                    uploading ? <CircularProgress color="inherit" size={15} /> : 'Upload' }</Button> }
            </DialogActions>
        </Dialog>
    )
}

export default AddFeed

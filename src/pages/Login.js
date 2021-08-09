import { FormControl, TextField, Grid, Button, InputAdornment, IconButton, CircularProgress } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import Logo from '../assets/images/whitelogo.png'
import userApi from '../redux/api/user'
import { loginUser, logoutUser } from '../redux/actions/user'

const Login = ({ loginUser, logoutUser, user }) => {
    const history = useHistory()
    const [ section, setSection ] = useState('login')
    const [ showPassword, setShowPassword ] = useState(false)
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false)

    const defaultRegForm = {
        firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
    }
    const defaultLoginForm = {
        email: '', password: '',
    }

    const [ loginForm, setLoginForm ] = useState(defaultLoginForm)
    const [ registerForm, setRegisterForm ] = useState(defaultRegForm)
    const [ resetEmail, setResetEmail ] = useState('')

    const [ loginError, setLoginError ] = useState('')
    const [ registerError, setRegisterError ] = useState('')
    const [ resetError, setResetError ] = useState('')
    const [ message, setMessage ] = useState('')
    const [ processing, setProcessing ] = useState(false)

    const handleFormChange = (name, value) => {
        setRegisterForm({ ...registerForm, [name]: value })
    }

    const resetPassword = async () => {
        setResetError('')
        setMessage('')
        if( resetEmail ) {
            setProcessing(true)
            try{
                await userApi.resetPassword(resetEmail)
                setMessage('Kindly check your mailbox for a reset Email')
                setResetEmail('')
            }
            catch(err) {
                setResetError(err.message)
            }
            finally {
                setProcessing(false)
            }
        }
        else setResetError('Email Address is required')
    }

    const login = async () => {
        setLoginError('')
        setProcessing(true)
        const { email, password } = loginForm
        if( email && password ) {
            try{
                await loginUser(loginForm)
                history.push('news-feed')
            }
            catch(err) {
                setLoginError(err.message)
            }
            finally {
                setProcessing(false)
            }
        }
        else setLoginError('Email Address and Password is required')
    }

    const register = async () => {
        setRegisterError('')
        setMessage('')
        const { firstName, lastName, email, password, confirmPassword } = registerForm
        if( firstName && lastName && email && password && password === confirmPassword ) {
            setProcessing(true)
            try{
                await userApi.registerUser(registerForm)
                setMessage("Registration Successful, Kindly visit your mailbox to verify you email address and then login")
                setRegisterForm(defaultRegForm)
            }
            catch(err) {
                setRegisterError(err.message)
            }
            finally {
                setProcessing(false)
            }
            
        } else if (password !== confirmPassword) setRegisterError('Password and Confirm Password do not match')
        else setRegisterError('All fields are required')
    }

    useEffect(() => {
        setProcessing(false)
        setMessage('')
        setLoginError('')
        setRegisterError('')
        setResetError('')
        setShowPassword(false)
        setShowConfirmPassword(false)
    }, [section])


    return (
        <Grid container style={{ minHeight: '100vh' }}>
            <Grid item md={4} xs={12} style={{ backgroundColor: '#093028' }} className='d-flex-column justify-center'>
                <Link to="/">
                    <img src={Logo} className="home-logo" />
                </Link>
            </Grid>

            <Grid item md={8} xs={12}  className='d-flex-column justify-center'>
                <form className="card form-group"
                    data-aos="flip-left"
                    data-aos-easing="ease-out-cubic"
                    data-aos-duration="2000"
                >   
                    { 
                        section == 'login' ? 
                        <>
                            <h1>Login</h1>
                            <h3>Welcome Back to the Community</h3>
                            <FormControl className="form-control">
                                <TextField type="email" variant="outlined" placeholder="Enter Email Address"
                                    label="Email Address"
                                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value}) }
                                />
                            </FormControl>
                            
                            <FormControl className="form-control">
                                <TextField variant="outlined" placeholder="Enter Password"
                                    type={showPassword ? 'text' : "password"} label="Password"
                                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    className="no-margin"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    { !showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </FormControl>

                            {
                                loginError && <p className="error-text">{loginError}</p>
                            }

                            <Button onClick={() => login()} variant="contained" color="primary" className="button">
                                {
                                    processing ? <CircularProgress size={20} style={{ color: '#FFF' }} /> : "Login"
                                }
                            </Button>

                            <p>Don't have an account? <a onClick={() => setSection('sign-up')}>Sign Up</a></p>

                            <p>Forgot your password? <a onClick={() => setSection('forgot-password')}>Reset here</a></p>
                        </>
                        :
                        section == 'forgot-password' ?
                        <>
                            <h1>Password Reset</h1>
                            {/* <h3></h3> */}
                            <FormControl className="form-control">
                                <TextField type="email" variant="outlined"
                                    placeholder="Enter Email Address"
                                    label="Email Address"
                                    onChange={(e) => setResetEmail(e.target.value)}
                                />
                            </FormControl>
                            {
                                resetError && <p className="error-text">{resetError}</p>
                            }
                            <Button variant="contained" color="primary" className="button" onClick={() => resetPassword()}>
                                { processing ? <CircularProgress size={20} style={{ color: '#FFF' }} /> : "Reset Password"}
                            </Button>

                            <p><a onClick={() => setSection('login')}>Back to Login</a></p>
                        </>
                        :
                        <>
                            <h1>Sign Up</h1>
                            <h3>Join our Community</h3>
                            <FormControl className="form-control">
                                <TextField 
                                    type="text" 
                                    variant="outlined" 
                                    placeholder="Enter First Name"
                                    label="First Name"
                                    onChange={({ target }) => handleFormChange('firstName', target.value)}
                                />
                            </FormControl>

                            <FormControl className="form-control">
                                <TextField type="text" variant="outlined" placeholder="Enter Last Name"
                                    label="Last Name"
                                    onChange={({ target }) => handleFormChange('lastName', target.value)}
                                
                                />
                            </FormControl>

                            <FormControl className="form-control">
                                <TextField type="email" variant="outlined" placeholder="Enter Email Address"
                                    label="Email Address"
                                    onChange={({ target }) => handleFormChange('email', target.value)}
                                />
                            </FormControl>
                            
                            <FormControl className="form-control">
                                <TextField variant="outlined" placeholder="Password"
                                    onChange={({ target }) => handleFormChange('password', target.value)}
                                    type={showPassword ? 'text' : "password" }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    className="no-margin"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    { !showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </FormControl>

                            <FormControl className="form-control">
                                <TextField variant="outlined" placeholder="Confirm Password"
                                    onChange={({ target }) => handleFormChange('confirmPassword', target.value)}
                                    type={showConfirmPassword ? 'text' : "password"}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    className="no-margin"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                >
                                                    { !showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </FormControl>
                                {
                                    registerError && <p className="error-text">{registerError}</p>   
                                }
                                {
                                    message && <p className="success-text">{message}</p>   
                                }
                            <Button variant="contained" color="primary" className="button" onClick={() => register()}>
                                { processing ? <CircularProgress size={20} style={{ color: '#FFF' }} /> : "Sign Up" }
                            </Button>

                            <p>Have an account? <a onClick={() => setSection('login')}>Login</a></p>
                        </>
                    }
                </form>


                <div className="footer">
                    <p>Copyright © 2021 Supply Sargent LLC - All Rights Reserved</p>
                </div>
            </Grid>

        </Grid>
    )
}
const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ loginUser, logoutUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

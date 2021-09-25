import { FormControl, TextField, Grid, Button, InputAdornment, IconButton, CircularProgress, Tabs, Tab } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import userApi from '../redux/api/user'
import { loginUser, logoutUser } from '../redux/actions/user'
import PageContainer from '../components/PageContainer'

const Auth = ({ loginUser, logoutUser, user }) => {
    const history = useHistory()
    const [ section, setSection ] = useState('auth')
    const [ showPassword, setShowPassword ] = useState(false)
    const [ activeTab, setActiveTab ] = useState(0)
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

    const resetPassword = async (e) => {
        e.preventDefault()
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

    const login = async (e) => {
        e.preventDefault();
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

    const register = async (e) => {
        e.preventDefault()
        setRegisterError('')
        setMessage('')
        console.log(registerForm)
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

    useEffect(() => {
        switch(history.location.pathname) {
            case '/login':
                setActiveTab(0);
                setSection('auth');
                break;
            case '/sign-up':
                setActiveTab(1);
                setSection('auth');
                break;
            case '/forgot-password':
                setActiveTab(0);
                setSection('forgot-password');
                break;
            default:
                setActiveTab(0);
                setSection('auth');
                break;
        }
    }, [history.location])


    return (
        <PageContainer secondary>
            { 
                section === 'auth' && 
                <Tabs className="tabs" value={activeTab} onChange={(e, value) => setActiveTab(value)} centered indicatorColor="primary">
                    <Tab label="LOGIN" />
                    <Tab label="SIGN UP" />
                </Tabs>
            }
    
            { 
                section === 'auth' && activeTab === 0 ? 
                <form onSubmit={(e) => login(e)}>
                    <h1>Login</h1>
                    <h3>Welcome Back to the Community</h3>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth type="email" variant="outlined" placeholder="Enter Email Address"
                                label="Email Address"
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value}) }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="outlined" placeholder="Enter Password"
                                type={showPassword ? 'text' : "password"} label="Password" fullWidth
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
                        </Grid>
                        <Grid item xs={12}>
                            {
                                loginError && <p className="error-text">{loginError}</p>
                            }

                            <Button type='submit' style={{ width: '80%'}} variant="outlined" color="primary" className="btn">
                                {
                                    processing ? <CircularProgress size={15} /> : "Login"
                                }
                            </Button>
                        </Grid>
                    </Grid>


                    <p>Don't have an account? <Link to="sign-up">Sign Up</Link></p>

                    <p>Forgot your password? <Link to="forgot-password">Reset here</Link></p>
                </form>
                :
                section === 'auth' && activeTab === 1 ?
                <form onSubmit={(e) => register(e)}>
                    <h1>Sign Up</h1>
                    <h3>Join our Community</h3>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField 
                                variant="outlined" 
                                placeholder="Enter First Name"
                                label="First Name" fullWidth name="firstName"
                                onChange={({ target }) => handleFormChange('firstName', target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="lastName" variant="outlined" placeholder="Enter Last Name"
                                label="Last Name" fullWidth
                                onChange={({ target }) => handleFormChange('lastName', target.value)}
                            
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField type="email" variant="outlined" placeholder="Enter Email Address"
                                label="Email Address" fullWidth name="email"
                                onChange={({ target }) => handleFormChange('email', target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="outlined" placeholder="Password"
                                onChange={({ target }) => handleFormChange('password', target.value)}
                                type={showPassword ? 'text' : "password" } fullWidth label="Password" name="password"
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="outlined" placeholder="Confirm Password"
                                onChange={({ target }) => handleFormChange('confirmPassword', target.value)}
                                type={showConfirmPassword ? 'text' : "password"} fullWidth label="Confirm Password" name="confirmPassword"
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
                        </Grid>
                        <Grid item xs={12}>
                            {
                                registerError && <p className="error-text">{registerError}</p>   
                            }
                            {
                                message && <p className="success-text">{message}</p>   
                            }
                            <Button style={{ width: '80%'}} variant="outlined" color="primary" className="btn" type="submit">
                                { processing ? <CircularProgress size={15}/> : "Sign Up" }
                            </Button>
                        </Grid>
                    </Grid>

                    <p>Have an account? <Link to="/login">Login</Link></p>
                </form>
                :
                <form onSubmit={(e) => resetPassword(e)}>
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
                    <Button style={{ width: '80%'}} variant="outlined" color="primary" className="btn" type="submit">
                        { processing ? <CircularProgress size={15} /> : "Reset Password"}
                    </Button>

                    <p><Link to="/login">Back to Login</Link></p>
                </form>
            }
        </PageContainer>
    )
}
const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ loginUser, logoutUser }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)

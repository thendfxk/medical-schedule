import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import './Login.scss';
import { FormattedMessage } from 'react-intl';

// import adminService from '../services/adminService';
import adminService from '../../services/adminService';
import { handleRegisterApi } from '../../services/userService'
import { toast } from "react-toastify";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isShowPassword: false,
            firstName: '',
            lastName: '',
        }

    }

    handleOnChangeemail = (event) => {
        this.setState({
            email: event.target.value
        })
    }
    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }
    handleRegister = async () => {
        this.setState({
            errMessage: ''
        })
        console.log('state ', this.state)
        if (!this.state.email || !this.state.password || !this.state.firstName || !this.state.lastName) {
            this.setState({
                errMessage: 'missing parameters',
                email: '',
                password: '',
                firstName: '',
                lastName: '',
            })
            return;
        }
        try {
            let data = await handleRegisterApi({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
            });
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.errMessage,
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                })
            }
            if (data && data.errCode === 0) {
                toast.success('Tao user thanh cong/ vui long dang nhap')
                const { navigate } = this.props;
                const redirectPath = '/login';
                navigate(`${redirectPath}`);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data.message) {
                    this.setState({
                        errMessage: 'Bi loi roi'
                    })
                }
            }

        }

    }
    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }
    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleLogin();
        }
    }
    handleOnChangeInput = (event, id) => {
        let inputValue = event.target.value;
        let copyState = { ...this.state };
        copyState[id] = inputValue;
        this.setState({
            ...copyState,
        })
    }
    render() {
        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-context row'>
                        <div className='col-12 login-text'>Register</div>
                        <div className='col-12 from-group login-input'>
                            <label>Email</label>
                            <input type='text' className='form-control '
                                placeholder='Enter your email' value={this.state.email}
                                onChange={(event) => this.handleOnChangeemail(event)}
                            ></input>
                        </div>
                        <div className='col-12 from-group login-input'>
                            <label>Password</label>
                            <div className='custom-input-password'>
                                <input type={this.state.isShowPassword ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Enter you password' value={this.state.password}
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                    onKeyDown={(event) => this.handleKeyDown(event)}
                                ></input>
                                <span
                                    onClick={() => { this.handleShowHidePassword() }}
                                > <i class={this.state.isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}> </i></span>

                            </div>
                        </div>
                        <div className='col-12 from-group login-input'>
                            <label>FirstName</label>
                            <input type='text' className='form-control '
                                placeholder='Enter your firstName' value={this.state.firstName}
                                onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                            ></input>
                        </div>
                        <div className='col-12 from-group login-input'>
                            <label>LastName</label>
                            <input type='text' className='form-control '
                                placeholder='Enter your lastName' value={this.state.lastName}
                                onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                            ></input>
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errMessage}

                        </div>
                        <div className='col-12 '>
                            <button className='btn-login'
                                onClick={() => { this.handleRegister() }}
                            >Register</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './ResetPassword.scss';
import { handleResetPassWord, checkTokenResetPassword } from '../../services/userService'
import { toast } from "react-toastify";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isShowPassword: false,
            password: '',
            confirmpassword: '',
            name: '',
            displayResetPw: true,
            errMessage: '',
        }

    }
    handleResetPassword = async () => {
        this.setState({
            errMessage: ''
        })
        console.log('state ', this.state)
        if (!this.state.email && this.state.confirmpassword !== this.state.password) {
            this.setState({
                errMessage: 'missing parameters',
                email: '',
                password: '',
                confirmpassword: '',
            })
            return;
        }
        try {
            let data = await handleResetPassWord({
                email: this.state.email,
                password: this.state.password,
            });
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.errMessage,
                    email: '',
                })
            }
            if (data && data.errCode === 0) {
                toast.success('Đổi mật khẩu thành công vui lòng đăng nhập lại')
                const { navigate } = this.props;
                const redirectPath = '/login';
                navigate(`${redirectPath}`);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data.message) {
                    this.setState({
                        errMessage: 'Server bị lỗi xin thử lại'
                    })
                }
            }

        }

    }
    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }
    handleOnChangeCFPassword = (event) => {
        this.setState({
            confirmpassword: event.target.value
        })
    }
    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }
    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let res = await checkTokenResetPassword({
                token: token,
            })
            if (res && res.errCode === 0) {
                this.setState({
                    name: `${res.data.firstName} ${res.data.lastName}`,
                    displayResetPw: true,
                    email: res.data.email
                })
            }
            else {
                this.setState({
                    displayResetPw: false,
                    errMessage: res.errMessage
                })
            }
        }
    }
    render() {
        return (
            <>
                {this.state.displayResetPw ?
                    <div className='reset-background'>
                        <div className='reset-container'>
                            <div className='reset-context row'>
                                <div className='col-12 reset-text'>Reset PassWord</div>
                                <div className='col-12' style={{ color: 'red' }}>
                                    Xin chào {this.state.name}! hãy đổi mật khẩu cho tài khoản của bạn:
                                </div>
                                <div className='col-12 from-group reset-input'>
                                    <label>Password</label>
                                    <div className='custom-input-password'>
                                        <input type={this.state.isShowPassword ? 'text' : 'password'}
                                            className='form-control'
                                            placeholder='Enter you password' value={this.state.password}
                                            onChange={(event) => this.handleOnChangePassword(event)}
                                        ></input>
                                        <span
                                            onClick={() => { this.handleShowHidePassword() }}
                                        > <i class={this.state.isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}> </i></span>

                                    </div>
                                </div>
                                <div className='col-12 from-group reset-input'>
                                    <label>Confirm Password</label>
                                    <div className='custom-input-password'>
                                        <input type={this.state.isShowPassword ? 'text' : 'password'}
                                            className='form-control'
                                            placeholder='Enter you password' value={this.state.confirmpassword}
                                            onChange={(event) => this.handleOnChangeCFPassword(event)}
                                        ></input>
                                        <span
                                            onClick={() => { this.handleShowHidePassword() }}
                                        > <i class={this.state.isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}> </i></span>

                                    </div>
                                </div>
                                <div className='col-12' style={{ color: 'red' }}>
                                    {this.state.errMessage}
                                </div>
                                <div className='col-12 '>
                                    <button className='btn-reset'
                                        onClick={() => { this.handleResetPassword() }}
                                    >Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <div className='verify'>
                            <div className='verify-succeed'>
                                <div className='verify-confirm-fail'>
                                    <p>Oops bị lỗi rồi! Vui lòng kiểm tra lại</p>
                                    <p>*{this.state.errMessage}*</p>
                                </div>
                            </div>
                        </div>

                    </div>
                }
            </>
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
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);

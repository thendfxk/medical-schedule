import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './ForgotPassword.scss';

// import adminService from '../services/adminService';
import adminService from '../../services/adminService';
import { handleForgotPassWord } from '../../services/userService'
import { toast } from "react-toastify";

class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isShowPassword: false,
        }

    }

    handleOnChangeemail = (event) => {
        this.setState({
            email: event.target.value
        })
    }
    handleChangePassword = async () => {
        this.setState({
            errMessage: ''
        })
        console.log('state ', this.state)
        if (!this.state.email) {
            this.setState({
                errMessage: 'missing parameters',
                email: '',
            })
            return;
        }
        try {
            let data = await handleForgotPassWord({
                email: this.state.email,
            });
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.errMessage,
                    email: '',
                })
            }
            if (data && data.errCode === 0) {
                toast.success('Xin vui lòng vào email để xác nhận và reset mật khẩu')
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
            <div className='forgot-background'>
                <div className='forgot-container'>
                    <div className='forgot-context row'>
                        <div className='col-12 forgot-text'>Change Password</div>
                        <div className='col-12 from-group forgot-input'>
                            <label>Email</label>
                            <input type='text' className='form-control '
                                placeholder='Enter your email' value={this.state.email}
                                onChange={(event) => this.handleOnChangeemail(event)}
                            ></input>
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12 '>
                            <button className='btn-forgot'
                                onClick={() => { this.handleChangePassword() }}
                            >Submit</button>
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
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);

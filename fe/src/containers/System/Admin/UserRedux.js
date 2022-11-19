import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService, handleGetPermission } from '../../../services/userService';
import { LANGUAGES, CRUD_ACTION, CommonUtils } from '../../../utils'
import * as actions from "../../../store/actions"
import "./userRedux.scss";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import TableManageUser from './TableManageUser';
import { USER_ROLE } from '../../../utils/constant';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',
            action: '',
            userEditId: '',
            authRole: '',
        }
        this.Permission(this.props.userInfo.accessToken);

    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            this.setState({
                genderArr: this.props.genderRedux,
                gender: this.props.genderRedux && this.props.genderRedux.length > 0 ? this.props.genderRedux[0].keyMap : '',
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            this.setState({
                positionArr: this.props.positionRedux,
                position: this.props.positionRedux && this.props.positionRedux.length > 0 ? this.props.positionRedux[0].keyMap : '',
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            this.setState({
                roleArr: this.props.roleRedux,
                role: this.props.roleRedux && this.props.roleRedux.length > 0 ? this.props.roleRedux[0].keyMap : '',
            })
        }
        if (prevProps.listusers !== this.props.listusers) {

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: '',
                position: '',
                role: '',
                avatar: '',
                gender: this.props.genderRedux && this.props.genderRedux.length > 0 ? this.props.genderRedux[0].keyMap : '',
                position: this.props.positionRedux && this.props.positionRedux.length > 0 ? this.props.positionRedux[0].keyMap : '',
                role: this.props.roleRedux && this.props.roleRedux.length > 0 ? this.props.roleRedux[0].keyMap : '',
                action: CRUD_ACTION.CREATE,
            })
        }
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            const objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64,
            })
        }
    }

    openPreviewImg = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true
        })
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) {
            return;
        } else {
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
            })
        }
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, () => {
            console.log('checkinput onchange ', this.state)
        })

    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'lastName', 'firstName', 'phoneNumber', 'address']
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('This input required: ' + arrCheck[i])
                break;
            }
        }
        return isValid;

    }
    handleEditUserFromParrent = (user) => {
        let imageBase64 = ''
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }

        this.setState({
            email: user.email,
            password: '123',
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phoneNumber: user.phonenumber ? user.phonenumber : '',
            gender: user.gender,
            role: user.roleId,
            position: user.positionId,
            action: CRUD_ACTION.EDIT,
            userEditId: user.id,
            avatar: imageBase64,
            previewImgURL: imageBase64,
        })
    }
    handleEditUser = () => {
        let isValid = this.checkValidateInput();
        console.log('vo day', isValid)
        if (isValid === false) {
            return;
        } else {
            let a = this.props.editNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                id: this.state.userEditId,
                avatar: this.state.avatar,
            })
            console.log('aaa', a)
        }
    }
    Permission = async (token) => {
        console.log('voday')
        let per = await handleGetPermission({ token });
        if (per && per.errCode === 0) {
            this.setState({
                authRole: per.role
            })
        } else {
            this.setState({
                authRole: 'guest'
            })
        }
    }
    render() {
        let linkToRedirect = '';
        if (this.state.authRole === USER_ROLE.DOCTOR) {
            toast.error('Bạn chưa được cấp quyền Admin, vui lòng báo hệ thống để được hỗ trợ')
            linkToRedirect = '/doctor/manager-schedule';
            return (
                <Redirect to={linkToRedirect} />
            )
        }
        else if (!this.props.isLoggedIn || this.state.authRole === USER_ROLE.PATIENT) {
            toast.error('Bạn chưa được cấp quyền Admin, vui lòng báo hệ thống để được hỗ trợ')
            linkToRedirect = '/home';
            return (
                <Redirect to={linkToRedirect} />
            )
        }
        let genders = this.state.genderArr;
        let language = this.props.language;
        let isGetGender = this.props.isLoadingGender;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;

        let { email, password, lastName, firstName,
            phoneNumber, address, gender, position, role, avatar } = this.state;

        return (
            <div className='user-redux-container'>
                <div className='title'>
                    QUAN LI USER
                </div>
                <div className="user-redux-body" >
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'><FormattedMessage id='manage-user.add' /></div>
                            <div className='col-12 my-3' >{isGetGender === true ? 'loading gender ' : ''}</div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.email' /></label>
                                <input className='form-control' type='email'
                                    value={email} onChange={(event) => this.onChangeInput(event, 'email')}
                                    disabled={this.state.action === CRUD_ACTION.EDIT ? true : false} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.password' /></label>
                                <input className='form-control' type='password'
                                    value={password} onChange={(event) => this.onChangeInput(event, 'password')}
                                    disabled={this.state.action === CRUD_ACTION.EDIT ? true : false} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.firstname' /></label>
                                <input className='form-control' type='text'
                                    value={firstName} onChange={(event) => this.onChangeInput(event, 'firstName')} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.lastname' /></label>
                                <input className='form-control' type='text'
                                    value={lastName} onChange={(event) => this.onChangeInput(event, 'lastName')} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.phonenumber' /></label>
                                <input className='form-control' type='text'
                                    value={phoneNumber} onChange={(event) => this.onChangeInput(event, 'phoneNumber')} />
                            </div>
                            <div className='col-9'>
                                <label><FormattedMessage id='manage-user.address' /></label>
                                <input className='form-control' type='text'
                                    value={address} onChange={(event) => this.onChangeInput(event, 'address')} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.gender' /></label>
                                <select className='form-control'
                                    onChange={(event) => this.onChangeInput(event, 'gender')}
                                    value={gender}>
                                    {genders && genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language == 'vi' ? item.valueVI : item.valueEN}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.position' /></label>
                                <select className='form-control'
                                    onChange={(event) => this.onChangeInput(event, 'position')}
                                    value={position}>

                                    {positions && positions.length > 0 &&
                                        positions.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language == 'vi' ? item.valueVI : item.valueEN}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.roleID' /></label>
                                <select className='form-control'
                                    onChange={(event) => this.onChangeInput(event, 'role')}
                                    value={role}>
                                    {roles && roles.length > 0 &&
                                        roles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language == 'vi' ? item.valueVI : item.valueEN}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.image' /></label>
                                <div className='preview-img-container'>
                                    <input id='previewImg' type='file' hidden
                                        onChange={(event) => this.handleOnchangeImage(event)} />
                                    <label className='label-upload' htmlFor='previewImg'>Tải ảnh <i className='fas fa-upload'></i></label>
                                    <div style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                        className='preview-image'
                                        onClick={() => this.openPreviewImg()}>

                                    </div>
                                </div>

                            </div>
                            <div className='col-12 my-3'>
                                <button className={this.state.action === CRUD_ACTION.EDIT ? 'btn btn-warning' : 'btn btn-primary'}
                                    onClick={this.state.action === CRUD_ACTION.EDIT ? () => this.handleEditUser() : () => this.handleSaveUser()}>
                                    {this.state.action === CRUD_ACTION.EDIT ?
                                        <FormattedMessage id='manage-user.edit' /> :
                                        <FormattedMessage id='manage-user.save' />
                                    }
                                </button>
                            </div>

                            <div className='col-12'><TableManageUser
                                handleEditUserFromParrent={this.handleEditUserFromParrent}
                                action={this.state.action}
                            /></div>
                        </div>
                    </div>
                </div>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}

                    />
                }
            </div>

        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        listusers: state.admin.users,
        userInfo: state.user.userInfor,
        isLoggedIn: state.user.isLoggedIn,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        // processLogout: () => dispatch(actions.processLogout()),
        // changelanguageAppRedux: (language) => dispatch(actions.changelanguage(language))
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUsersRedux: () => { dispatch(actions.fetchAllUsersStart()) },
        editNewUser: (user) => { dispatch(actions.editNewUser(user)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);

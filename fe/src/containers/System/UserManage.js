import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import "./userManage.scss";
import { getAllUsers } from "../../services/userService"
import { createNewUserService, handleGetPermission } from "../../services/userService"
import { deleteUserbyId } from "../../services/userService"
import ModalUser from './ModalUser';
import { emitter } from "../../utils/emitter"
import ModalEditUser from './ModalEditUser';
import { editUser } from "../../services/userService"
import { USER_ROLE } from '../../utils/constant';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenEditModalUser: false,
            editUser: {},
            authRole: '',

        }
        this.Permission(this.props.userInfo.accessToken);
    }
    //lifecycle : vong do
    // run component:
    //run constructor -> khoi tao state
    //did mount (set state )
    //render

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL');
        console.log("get user to ReactJS  " + response);
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }
    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            console.log('API ', response);
            if (response && response.errCode != 0) {
                alert(response.errMessage);
            }
            else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false,
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleDeleteUser = async (data) => {
        try {
            let response = await deleteUserbyId(data.id)
            if (response && response.errCode === 0) {
                await this.getAllUsersFromReact();
            } else {
                alert('Missing ' + response.errMessage)
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleEditUser = (user) => {
        console.log('da vo edit user ', user);
        this.setState({
            isOpenEditModalUser: true,
            editUser: user,
        })
    }

    toggleEditUserModal = () => {
        this.setState({
            isOpenEditModalUser: !this.state.isOpenEditModalUser,
        })
    }
    doEditUser = async (user) => {
        try {
            let res = await editUser(user);
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenEditModalUser: false,
                })
                await this.getAllUsersFromReact();
            } else {
                alert(res.errMessage)
            }

        } catch (error) {
            console.log(error);
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
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParrent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {
                    this.state.isOpenEditModalUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenEditModalUser}
                        toggleFromParrent={this.toggleEditUserModal}
                        editUser={this.state.editUser}
                        saveEditUser={this.doEditUser}
                    />
                }


                <div className='title text-center'> Manage User </div>
                <div className='mx-1'>
                    <button className='btn btn-primary px-3'
                        onClick={() => this.handleAddNewUser()}>
                        <i className='fas fa-plus'> Add new user</i>
                    </button>
                </div>
                <div className='user-table mt-3 mx-1'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>FirstName</th>
                                <th>LastName</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                            {arrUsers && arrUsers.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit'
                                                onClick={() => { this.handleEditUser(item) }}
                                            ><i className='fas fa-pencil-alt'></i></button>
                                            <button className='btn-delete'
                                                onClick={() => { this.handleDeleteUser(item) }}
                                            ><i className='fas fa-trash'></i></button>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions"

import "./TableManageUser.scss";
import { handleGetPermission } from '../../../services/userService';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { USER_ROLE } from '../../../utils/constant';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
const mdParser = new MarkdownIt(/* Markdown-it options */);
function handleEditorChange({ html, text }) {
    console.log('handleEditorChange', html, text);
}

class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userRedux: [],
            authRole: '',
        }
        this.Permission(this.props.userInfo.accessToken);
    }

    componentDidMount() {
        this.props.fetchUsersRedux();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listusers !== this.props.listusers) {
            this.setState({
                userRedux: this.props.listusers,
            })
        }
    }

    handleDeleteUser = (user) => {
        this.props.fetchDeleteUser(user.id)

    }
    handleEditUser = (user) => {
        console.log('user edit ', user)
        this.props.handleEditUserFromParrent(user);
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

        let allusers = this.state.userRedux;
        return (
            <React.Fragment>
                <table id='TableManageUser' >
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                        {allusers && allusers.length > 0 &&
                            allusers.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit'
                                                onClick={() => this.handleEditUser(item)}
                                            ><i className='fas fa-pencil-alt'></i></button>
                                            <button className='btn-delete'
                                                onClick={() => this.handleDeleteUser(item)}
                                            ><i className='fas fa-trash'></i></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
                <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
            </React.Fragment>

        );
    }

}

const mapStateToProps = state => {
    return {
        listusers: state.admin.users,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfor,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUsersRedux: () => { dispatch(actions.fetchAllUsersStart()) },
        fetchDeleteUser: (id) => { dispatch(actions.deleteUser(id)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);

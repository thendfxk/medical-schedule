import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { USER_ROLE } from '../utils/constant';

class Home extends Component {

    render() {
        const { isLoggedIn, userInfo } = this.props;
        let linkToRedirect = '';
        console.log('user info', userInfo)
        if (isLoggedIn) {
            if (userInfo.roleId === USER_ROLE.ADMIN) {
                linkToRedirect = '/system/manage-doctor';
            }
            else if (userInfo.roleId === USER_ROLE.DOCTOR) {
                linkToRedirect = '/doctor/manager-schedule';
            }
            else {
                linkToRedirect = '/home';
            }
        } else {
            linkToRedirect = '/home';
        }
        // let linkToRedirect = isLoggedIn ? '/system/user-manage' : '/home';

        return (
            <Redirect to={linkToRedirect} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);

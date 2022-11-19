import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handleGetPermission } from '../../services/userService';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
            authRole: '',
        }
    }
    handleChangeLanguage = (language) => {
        this.props.changelanguageAppRedux(language);
    }
    componentDidMount = async () => {
        await this.Permission(this.props.userinfo.accessToken);
        let { authRole } = this.state;
        let menu = []
        if (authRole === USER_ROLE.ADMIN) {
            menu = adminMenu;
        }
        if (authRole === USER_ROLE.DOCTOR) {
            menu = doctorMenu;
        }

        this.setState({
            menuApp: menu
        })
    }
    Permission = async (token) => {
        console.log('vao dayyy')
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
        const { processLogout, language, userinfo } = this.props;
        console.log("menu app", this.state.menuApp)
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>
                <div className='languages'>
                    <span className='welcome'>
                        <FormattedMessage id="homeheader.welcome" />
                        {userinfo && userinfo.firstName ? userinfo.firstName : ''}!
                    </span>
                    <span className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}
                        onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}>
                        VN
                    </span>
                    <span className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}
                        onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}>
                        EN
                    </span>
                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userinfo: state.user.userInfor,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changelanguageAppRedux: (language) => dispatch(actions.changelanguage(language))

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import logo from '../../assets/logo.svg'
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils/constant';
import { changelanguage, processLogout } from '../../store/actions'
import { withRouter } from 'react-router';
class HomeHeader extends Component {

    changeLanguage = (lan) => {
        this.props.changelanguageAppRedux(lan);
    }
    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push('/home')
        }
    }
    render() {
        let language = this.props.language;
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i class='fas fa-bars'></i>
                            <img className='header-logo' src={logo} onClick={() => { this.returnToHome() }} />
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.speciality" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.searchdoctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.select-facility" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.Choose-a-good-doctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div > <b><FormattedMessage id="homeheader.Medical-package" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.General-health-check" /></div>
                            </div>

                        </div>
                        <div className='right-content'>
                            <div className='support'>
                                <i className='fas fa-question-circle'><FormattedMessage id="homeheader.Support" /></i>
                            </div>
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => this.changeLanguage('vi')}>VN</span></div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => this.changeLanguage('en')}>EN</span></div>
                            {this.props.isLoggedIn ?
                                <div className="btn btn-logout" onClick={this.props.processLogout}>
                                    <i className="fas fa-sign-out-alt"></i>
                                </div>
                                :
                                <div>

                                </div>
                            }

                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title-1'><FormattedMessage id="banner.medicalplatform" /></div>
                            <div className='title-2'> <FormattedMessage id="banner.comprehensive-health-care" /> </div>
                            <div className='search'>
                                <i className='fas fa-search'></i>
                                <input type='text' />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='options-child'>
                                    <div className='icon-child'><i className='far fa-hospital'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.speacialist-examination" /> </div>
                                </div>
                                <div className='options-child'>
                                    <div className='icon-child'><i className='fas fa-mobile-alt'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.remote-examination" /> </div>
                                </div>
                                <div className='options-child'>
                                    <div className='icon-child'><i className='fas fa-procedures'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.general-examination" /> </div>
                                </div>
                                <div className='options-child'>
                                    <div className='icon-child'><i className='fas fa-microscope'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.medical-test" /> </div>
                                </div>
                                <div className='options-child'>
                                    <div className='icon-child'><i className='fas fa-user-md'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.spirit-health" /> </div>
                                </div>
                                <div className='options-child'>
                                    <div className='icon-child'><i className='fas fa-tooth'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.dentis-examination" /> </div>
                                </div>
                            </div>

                        </div>

                    </div>
                }
            </React.Fragment>

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
        changelanguageAppRedux: (language) => dispatch(changelanguage(language)),
        processLogout: () => dispatch(processLogout()),

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));

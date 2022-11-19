import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ProfileDoctor.scss'
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format'

import { Link } from 'react-router-dom'
import { getProfileDoctorById } from '../../../services/userService'
import _ from 'lodash';
import moment from 'moment/moment';
class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }
    async componentDidMount() {
        let data = await this.getProfileDoctor(this.props.doctorId)
        this.setState({
            dataProfile: data
        })
    }
    getProfileDoctor = async (id) => {
        let result = {}
        if (id) {
            let res = await getProfileDoctorById(id);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.props.doctorId !== prevProps.doctorId) {

        }
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    renderBookingTime = (bookingTime) => {
        let { language } = this.props;
        let time = language === LANGUAGES.VI ? bookingTime.timeTypeData.valueVi : bookingTime.timeTypeData.valueEn
        if (bookingTime && !_.isEmpty(bookingTime)) {
            let date = language === LANGUAGES.VI ?
                this.capitalizeFirstLetter(moment.unix(+bookingTime.date / 1000).format('dddd - DD/MM/YYYY'))
                :
                moment.unix(+bookingTime.date / 1000).locale('en').format('ddd - DD/MM/YYYY')

            return (
                <>
                    <div>[{time}]   {date}</div>
                    <div><FormattedMessage id="patient.modal-booking.bookingforfree" /></div>
                </>
            )
        }
        return <></>

    }

    render() {
        let { language, isShowDescription, dataTime, isShowPrice, isShowDetail, doctorId } = this.props;
        console.log('check log state', this.state)
        let { dataProfile } = this.state;
        let nameVi, nameEn;
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi},${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn},${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        return (
            <div className='doctor-profile-container'>
                <div className='intro-doctor'>
                    <div className='content-left' style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}>
                    </div>
                    <div className='content-right'>
                        <div className='Up' >
                            <Link to={`/detail-doctor/${doctorId}`} >{language === LANGUAGES.VI ? nameVi : nameEn}</Link>
                        </div>
                        <div className='Down'>
                            {isShowDescription === true &&
                                <>
                                    {dataProfile.Markdown &&
                                        dataProfile.Markdown.desciption &&
                                        <div dangerouslySetInnerHTML={{ __html: dataProfile.Markdown.desciption }}>
                                        </div>}
                                    {this.renderBookingTime(dataTime)}

                                </>
                            }
                        </div>
                    </div>
                </div>
                {isShowPrice && isShowPrice == true ? <div className='price'>
                    <FormattedMessage id='patient.modal-booking.Medical-fee' />
                    {dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.VI ?
                        <NumberFormat
                            className='currency'
                            value={dataProfile.Doctor_Infor.priceData.valueVi}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'VND'}
                        /> : ''}

                    {dataProfile && dataProfile.Doctor_Infor && language === LANGUAGES.EN ?
                        <NumberFormat
                            className='currency'
                            value={dataProfile.Doctor_Infor.priceData.valueEn}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'$'}
                        /> : ''}
                </div>
                    :
                    <div></div>}

            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);

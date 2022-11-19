import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfor.scss';
import { getExtraInforDoctorById } from '../../../services/userService'
import { LANGUAGES } from '../../../utils';
import NumberFormat from 'react-number-format'
import { FormattedMessage } from 'react-intl';

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailedInfo: false,
            extraInfor: '',
        }
    }
    async componentDidMount() {
        let res = await getExtraInforDoctorById(this.props.doctorIdFromParent)
        if (res && res.errCode === 0) {
            this.setState({
                extraInfor: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let { language } = this.props;

        if (this.props.language !== prevProps.language) {

        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }
    showHiddenDetailInfor = (status) => {
        this.setState({ isShowDetailedInfo: status });
    }
    render() {
        // 
        let { language } = this.props;
        let { isShowDetailedInfo, extraInfor } = this.state;
        return (
            <div className='doctor-extra-infor-container'>
                <div className='content-up'>
                    <div className='text-address'><FormattedMessage id="patient.detail-doctor.address" /></div>
                    <div className='clinic-name'>
                        {extraInfor && extraInfor.nameClinic ?
                            language === LANGUAGES.VI ? <span>{extraInfor.clinicData.name}</span> : <span>{extraInfor.clinicData.nameEn}</span>
                            : ''}
                    </div>
                    <div className='address'>
                        {extraInfor && extraInfor.nameClinic ?
                            language === LANGUAGES.VI ? <span>{extraInfor.clinicData.address}</span> : <span>{extraInfor.clinicData.addressEn}</span>
                            : ''}
                    </div>
                </div>
                <div className='content-down'>
                    {isShowDetailedInfo === false &&
                        <>
                            <div className='short-infor'>
                                <div className='title-price'><FormattedMessage id="patient.detail-doctor.Medical-fee" />:
                                    {extraInfor && extraInfor.priceData
                                        ? language === LANGUAGES.VI ?
                                            <NumberFormat
                                                className='currency'
                                                value={extraInfor.priceData.valueVi}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'VND'}
                                            /> :
                                            <NumberFormat
                                                className='currency'
                                                value={extraInfor.priceData.valueEn}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={'$'}
                                            />
                                        : ''}
                                    <span className='formore' onClick={() =>
                                        this.showHiddenDetailInfor(true)}><FormattedMessage id="patient.detail-doctor.For-more" /></span>

                                </div>
                            </div>
                        </>

                    }
                    {isShowDetailedInfo === true &&
                        <>
                            <div className='title-price'><FormattedMessage id="patient.detail-doctor.Medical-fee" />.</div>
                            <div className='detail-infor'>
                                <div className='price'>
                                    <span className='left'><FormattedMessage id="patient.detail-doctor.Medical-fee" /></span>
                                    <span className='right'>
                                        {extraInfor && extraInfor.priceData
                                            ? language === LANGUAGES.VI ?
                                                <NumberFormat
                                                    className='currency'
                                                    value={extraInfor.priceData.valueVi}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={'VND'}
                                                /> :
                                                <NumberFormat
                                                    className='currency'
                                                    value={extraInfor.priceData.valueEn}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={'$'}
                                                />
                                            : ''}
                                    </span>
                                </div>
                                <div className='note'>
                                    {extraInfor.note && extraInfor.note ? extraInfor.note : ''}
                                </div>
                            </div>
                            <div className='payment'>
                                <FormattedMessage id="patient.detail-doctor.payment" />
                                {extraInfor.paymentData && language === LANGUAGES.VI ? extraInfor.paymentData.valueVi : ''}
                                {extraInfor.paymentData && language === LANGUAGES.EN ? extraInfor.paymentData.valueEn : ''}
                            </div>
                            <div className='hide-price'>
                                <span onClick={() => this.showHiddenDetailInfor(false)}>
                                    <FormattedMessage id="patient.detail-doctor.hide-details" />
                                </span>
                            </div>
                        </>
                    }
                </div>
            </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);

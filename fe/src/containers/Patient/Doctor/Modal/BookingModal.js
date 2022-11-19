import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import Lightbox from 'react-image-lightbox';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import Select from 'react-select';
// import DatePicker from '../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import DatePicker from '../../../../components/Input/DatePicker';
import { LANGUAGES } from "../../../../utils"
import { postPatientAppointment } from '../../../../services/userService'
import { toast } from "react-toastify";
import moment from 'moment/moment';
import { withRouter } from 'react-router-dom';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastName: '',
            firstName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            patientAge: '',
            genderIdentity: '',
            forwho: '',
            genders: [],
            doctorId: '',
            timetype: '',
            date: '',
        }
    }
    componentDidMount() {
        this.props.getGendersStart();

    }
    buildDataGenders = (data) => {
        let result = []
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map(item => {
                let object = {}
                object.label = language === LANGUAGES.VI ? item.valueVI : item.valueEN
                object.value = item.keyMap
                result.push(object)
            })
        }
        return result
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGenders(this.props.genderRedux)
            })
        }
        if (this.props.genderRedux !== prevProps.genderRedux) {
            this.setState({
                genders: this.buildDataGenders(this.props.genderRedux)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId
                let timetype = this.props.dataTime.timeType
                let date = this.props.dataTime.date
                console.log('date ', timetype, date)
                this.setState({
                    doctorId: doctorId,
                    timetype: timetype,
                    date: date
                })
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
    handleOnChangeDataPicker = (date) => {
        this.setState({
            doB: date[0]
        })
    }
    handleOnChangeGender = (selectedOption) => {
        this.setState({
            genderIdentity: selectedOption
        })
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    renderBookingTime = (bookingTime) => {
        let { language } = this.props;
        if (bookingTime && !_.isEmpty(bookingTime)) {
            let time = language === LANGUAGES.VI ? bookingTime.timeTypeData.valueVi : bookingTime.timeTypeData.valueEn
            let date = language === LANGUAGES.VI ?
                this.capitalizeFirstLetter(moment.unix(+bookingTime.date / 1000).format('dddd - DD/MM/YYYY'))
                :
                moment.unix(+bookingTime.date / 1000).locale('en').format('ddd - DD/MM/YYYY')
            return `${time}  -  ${date}`
        }
        return ''

    }
    renderDoctorName = (bookingTime) => {
        let { language } = this.props;
        if (bookingTime && !_.isEmpty(bookingTime)) {
            let doctorNameEn = `${this.props.dataTime.doctorData.firstName} ${this.props.dataTime.doctorData.lastName}`;
            let doctorNameVi = `${this.props.dataTime.doctorData.lastName} ${this.props.dataTime.doctorData.firstName}`;
            let doctorName = language === LANGUAGES.VI ? doctorNameVi : doctorNameEn;
            return doctorName;
        }
        return ''
    }
    handleConfirmBooking = async () => {
        let timeString = this.renderBookingTime(this.props.dataTime)
        let doctorName = this.renderDoctorName(this.props.dataTime)
        console.log('state', this.state)
        let res = await postPatientAppointment({
            lastName: this.state.lastName,
            firstName: this.state.firstName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            genderIdentity: this.state.genderIdentity,
            doctorId: this.state.doctorId,
            // forwho: this.state.forwho,
            timetype: this.state.timetype,
            date: this.state.date,
            language: this.props.language,
            pickDate: timeString,
            // patientAge: this.state.patientAge,
            doctorName: doctorName,
        })
        // console.log('check req', res)
        if (res && res.errCode === 0) {
            toast.success('Vui lòng kiểm tra email để xác nhận lịch hẹn.')
        }
        else {
            toast.error('Thêm lịch hẹn khong thành công')
        }
    }
    render() {
        let { isOpenModal, closeBookingModal, dataTime } = this.props;
        // console.log('check state modal', dataTime)
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : ''
        return (
            <Modal
                isOpen={isOpenModal}
                size='lg'
                centered={true}
                backdrop={true}
                toggle={closeBookingModal}
                className='booking-modal-container'>
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'><FormattedMessage id="patient.modal-booking.booking-infor" /></span>
                        <span className='right' onClick={closeBookingModal}><i className='fas fa-times'></i></span>
                    </div>

                    <div className='booking-modal-body'>
                        <div className='doctor-infor'>
                            {/* {JSON.stringify(dataTime)} */}
                            <ProfileDoctor
                                doctorId={doctorId}
                                isShowDescription={true}
                                dataTime={dataTime}
                                isShowPrice={true}
                                isShowDetail={true}
                            />
                        </div>
                        <div className='row'>
                            <div className='col-4 form-group'>
                                <label><FormattedMessage id="patient.modal-booking.lastname" /></label>
                                <input className='form-control'
                                    value={this.state.firstName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                />

                            </div>
                            <div className='col-4 form-group'>
                                <label><FormattedMessage id="patient.modal-booking.firstname" /></label>
                                <input className='form-control'
                                    value={this.state.lastName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                />

                            </div>
                            <div className='col-4 form-group'>
                                <label><FormattedMessage id="patient.modal-booking.phonenumber" /></label>
                                <input className='form-control'
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.modal-booking.email" /></label>
                                <input className='form-control'
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label><FormattedMessage id="patient.modal-booking.address-contact" /></label>
                                <input className='form-control'
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                />

                            </div>
                            <div className='col-12 form-group'>
                                <label><FormattedMessage id="patient.modal-booking.prognostic" /></label>
                                <input className='form-control'
                                    value={this.state.reason}
                                    onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                />
                            </div>
                            <div className='col-5 form-group'>
                                <label><FormattedMessage id="patient.modal-booking.booking-for" /></label>
                                <input className='form-control'
                                    value={this.state.forwho}
                                    onChange={(event) => this.handleOnChangeInput(event, 'forwho')}
                                />
                            </div>
                            <div className='col-4 form-group'>
                                <label><FormattedMessage id="patient.modal-booking.patientAge" /></label>
                                <input className='form-control'
                                    value={this.state.patientAge}
                                    onChange={(event) => this.handleOnChangeInput(event, 'patientAge')}
                                />

                            </div>
                            <div className='col-3 form-group'>
                                <label><FormattedMessage id="patient.modal-booking.genderIdentity" /></label>
                                <Select
                                    value={this.state.genderIdentity}
                                    onChange={this.handleOnChangeGender}
                                    options={this.state.genders}>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className='booking-modal-footer'>
                        <button onClick={() => this.handleConfirmBooking()} className='btn-booking-comfirm' >Xác nhận</button>
                        <button className='btn-booking-cancel' >Hủy</button>
                    </div>
                </div>
            </Modal >
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGendersStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingModal));

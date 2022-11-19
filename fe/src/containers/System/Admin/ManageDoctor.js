import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions"

import "./ManageDoctor.scss";
import Select from 'react-select';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CRUD_ACTION, LANGUAGES } from '../../../utils';
import { getDetailDoctorInfo, handleGetPermission } from "../../../services/userService"
import { USER_ROLE } from '../../../utils/constant';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);


class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: null,
            desciption: '',
            listDoctors: '',
            hasOlddata: false,
            //more info 
            listPrices: [],
            listPayments: [],
            listProvinces: [],
            listSpecialties: [],
            listClinics: [],

            selectedClinic: '',
            selectedSpecialty: '',
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',

            nameClinic: '',
            addressClinic: '',
            note: '',

            authRole: '',
        }
        this.Permission(this.props.userInfo.accessToken);
    }

    componentDidMount() {
        this.props.fetchAllDoctors(this.props.userInfo);
        this.props.getAllRequiredInfor();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USER')
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.allRequiredInfor !== this.props.allRequiredInfor) {
            let { resPrice, resPayment, resProvince } = this.props.allRequiredInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                listPrices: dataSelectPrice,
                listPayments: dataSelectPayment,
                listProvinces: dataSelectProvince,
            })
        }
        if (prevProps.allMarkdown !== this.props.allMarkdown) {
            this.setState({
                contentMarkdown: '',
                contentHTML: '',
                selectedDoctor: '',
                description: '',

                selectedClinic: '',
                selectedSpecialty: '',
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',

                nameClinic: '',
                addressClinic: '',
                note: '',
            })
        }
        if (prevProps.language !== this.props.language) {
            let { resPrice, resPayment, resProvince } = this.props.allRequiredInfor;
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USER')
            this.setState({
                listDoctors: dataSelect
            })
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                listPrices: dataSelectPrice,
                listPayments: dataSelectPayment,
                listProvinces: dataSelectProvince,
            })
        }
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text,
        })
    }
    handleSaveContentMarkdown = () => {
        let { hasOlddata } = this.state;

        this.props.savedetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            desciption: this.state.desciption,
            doctorId: this.state.selectedDoctor.value,
            action: hasOlddata === true ? CRUD_ACTION.EDIT : CRUD_ACTION.CREATE,
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,

            nameClinic: this.state.selectedClinic.label,
            addressClinic: this.state.addressClinic,
            note: this.state.note,

        })

    }
    handleChangeSelect = async (selectedDoctor) => {
        let { listPayments, listPrices, listProvinces } = this.state
        this.setState({
            selectedDoctor
        });
        let res = await getDetailDoctorInfo(selectedDoctor.value)
        console.log("manage doctor selected info", res)
        if (res && res.errCode === 0 && res.data && res.data.Markdown &&
            (res.data.Markdown.desciption || res.data.Markdown.contentHTML || res.data.Markdown.contentMarkdown)
        ) {
            if (res.data.Doctor_Infor) {
                let doctorInfor = res.data.Doctor_Infor;
                let paymentId = doctorInfor.paymentId;
                let priceId = doctorInfor.priceId;
                let provinceId = doctorInfor.provinceId;

                let Payment = '', Price = '', Province = ''

                Payment = listPayments.find(item => {
                    return item && item.value === paymentId
                })

                Price = listPrices.find(item => {
                    return item && item.value === priceId
                })

                Province = listProvinces.find(item => {
                    return item && item.value === provinceId
                })
                this.setState({
                    contentHTML: res.data.Markdown.contentHTML,
                    contentMarkdown: res.data.Markdown.contentMarkdown,
                    desciption: res.data.Markdown.desciption,
                    hasOlddata: true,
                    addressClinic: doctorInfor.addressClinic,
                    nameClinic: doctorInfor.nameClinic,
                    note: doctorInfor.note,
                    selectedPayment: Payment,
                    selectedPrice: Price,
                    selectedProvince: Province,
                })
            }
        } else {
            this.setState({
                addressClinic: '',
                nameClinic: '',
                selectedClinic: '',
                selectedSpecialty: '',
                selectedPayment: '',
                selectedPrice: '',
                selectedProvince: '',
                note: '',
                contentHTML: '',
                contentMarkdown: '',
                desciption: '',
                hasOlddata: false
            })
        }


    }
    handleChangeSelectInfor = (selectedInfor, name) => {
        let stateName = name.name;
        let stateCopy = { ... this.state };

        let { language, allClinics } = this.props


        stateCopy[stateName] = selectedInfor;
        this.setState({
            ...stateCopy,
        })
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ... this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy,
        })

    }
    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USER') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if (type === 'SPECIALTIES' || type === 'CLINICS') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = language === LANGUAGES.VI ? item.name : item.nameEn;
                    object.value = item.id;
                    result.push(object);
                })
            }
            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVI} VND`;
                    let labelEn = `${item.valueEN} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }
            if (type === 'PAYMENT' || type === 'PROVINCE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVI} `;
                    let labelEn = `${item.valueEN} `;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object);
                })
            }

        }
        return result;
    }
    Permission = async (token) => {
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
        const { selectedDoctor } = this.state;
        let { hasOlddata } = this.state;
        return (
            <div className='manage-doctor-container'>

                <div className='manage-doctor-title'>
                    <FormattedMessage id='admin.manage-doctor.title' />
                </div>
                <div className='more-info'>
                    <div className='content-left'>
                        <label><FormattedMessage id='admin.manage-doctor.choose' /></label>
                        <Select
                            value={selectedDoctor}
                            onChange={this.handleChangeSelect}

                            options={this.state.listDoctors}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id='admin.manage-doctor.profile-title' /></label>
                        <textarea className='form-control' row="4"
                            onChange={(event) => this.handleOnChangeText(event, 'desciption')}
                            value={this.state.desciption}
                        >
                        </textarea>
                    </div>
                </div>
                <div className='more-infor-extra row'>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.choose-price' />
                        </label>

                        <Select
                            placeholder={<FormattedMessage id='admin.manage-doctor.choose-price' />}
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectInfor}
                            name='selectedPrice'
                            options={this.state.listPrices} />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.choose-payment' /></label>
                        <Select
                            placeholder={<FormattedMessage id='admin.manage-doctor.choose-payment' />}
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectInfor}
                            name='selectedPayment'
                            options={this.state.listPayments} />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.choose-province' /></label>
                        <Select
                            placeholder={<FormattedMessage id='admin.manage-doctor.choose-province' />}
                            value={this.state.selectedProvince}
                            name='selectedProvince'
                            onChange={this.handleChangeSelectInfor}
                            options={this.state.listProvinces} />
                    </div>

                    <div className='col-4 form-group'>
                        <label>Phòng khám</label>
                        <input
                            onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                            value={this.state.nameClinic}
                            className='form-control' />
                    </div>
                    <div className='col-4 form-group'>
                        <label> <FormattedMessage id='admin.manage-doctor.clinic-address' /></label>
                        <input
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                            value={this.state.addressClinic}
                            className='form-control' />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.clinic-Note' /></label>
                        <input
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                            value={this.state.note}

                            className='form-control' />
                    </div>
                </div>
                <div className='manage-doctor-editor'>
                    <MdEditor style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />

                </div>
                <button
                    onClick={() => this.handleSaveContentMarkdown()}
                    className={hasOlddata === true ? 'save-content-doctor' : 'create-content-doctor'}
                >
                    {hasOlddata === true ? <span>
                        <FormattedMessage id='admin.manage-doctor.save' />

                    </span> : <span>
                        <FormattedMessage id='admin.manage-doctor.create' />
                    </span>}
                </button>
            </div>
        );
    }

}

const mapStateToProps = state => {
    console.log('vo rudeux');
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allRequiredInfor: state.admin.allRequiredInfor,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllRequiredInfor: () => dispatch(actions.getAllRequiredInfor()),
        fetchUsersRedux: () => { dispatch(actions.fetchAllUsersStart()) },
        fetchAllDoctors: (user) => { dispatch(actions.fetchAllDoctors(user)) },
        savedetailDoctor: (data) => { dispatch(actions.savedetailDoctor(data)) }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);

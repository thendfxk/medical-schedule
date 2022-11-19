import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../homepage/HomeHeader';
import "./DetailDoctor.scss";
import { getDetailDoctorInfo } from "../../../services/userService";
import { LANGUAGES } from '../../../utils/constant';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';

class DatailDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailDoctor: {},
        }
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let res = await getDetailDoctorInfo(this.props.match.params.id);
            if (res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data
                })
            }
        }
    }
    componentDidUpdate(prevProps, prevState, snapShot) {
    }
    render() {
        console.log('doctor ', this.state.detailDoctor)
        let detailDoctor = this.state.detailDoctor;
        let { language } = this.props;
        let nameVi, nameEn;
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi},${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn},${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }
        // c
        return (
            <React.Fragment>
                <HomeHeader isShowBanner={false} />
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div className='content-left'>
                            <div className='image'
                                style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})` }}
                            >

                            </div>
                        </div>
                        <div className='content-right'>
                            <div className='up'>
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className='down'>
                                {detailDoctor.Markdown &&
                                    detailDoctor.Markdown.desciption &&
                                    <div>{detailDoctor.Markdown.desciption}</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <DoctorSchedule
                                doctorIdFromParent={detailDoctor.id}
                            />
                        </div>
                        <div className='content-right'>
                            <DoctorExtraInfor
                                doctorIdFromParent={detailDoctor.id}
                            />
                        </div>
                    </div>

                    <div className='detail-infor-doctor'>
                        {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML
                            &&
                            <div dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }}>

                            </div>}
                    </div>

                    <div className='comment-doctor'>
                    </div>
                </div>
            </React.Fragment>

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

export default connect(mapStateToProps, mapDispatchToProps)(DatailDoctor);

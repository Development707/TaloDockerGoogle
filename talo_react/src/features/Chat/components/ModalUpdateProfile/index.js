import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Modal, Row } from 'antd';
import { FastField, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import InputFieldNotTitle from 'customfield/InputFieldNotTitle';
import DateOfBirthField from 'customfield/DateOfBirthField';
import GenderRadioField from 'customfield/GenderRadioField';
import UploadConverPhoto from 'components/UploadConverPhoto';
import UploadAvatar from 'components/UploadAvatar';
import { setAvatarProfile, setCoverPhotoProfile } from 'app/globalSlice';
import meApi from 'api/meApi';
import * as Yup from 'yup';
import './style.scss';
ModalUpdateProfile.propTypes = {
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    loading: PropTypes.bool,
};

ModalUpdateProfile.defaultProps = {
    isVisible: false,
    onCancel: null,
    onOk: null,
    loading: false,
};
function ModalUpdateProfile({ isVisible, onCancel }) {
    const formRef = useRef();
    const { user } = useSelector((state) => state.global);
    const dispatch = useDispatch();

    // state
    const [avatar, setAvatar] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [isClear, setIsClear] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const refInitValue = useRef();

    const handleGetCoverPhoto = (coverPhoto) => {
        // console.log('cover photo ', coverPhoto);
        setCoverPhoto(coverPhoto);
    };

    const handleGetAvatar = (avatar) => {
        // console.log('avatar', avatar);
        setAvatar(avatar);
    };
    const handleOke = () => {
        if (formRef.current) {
            // console.log(formRef.current);
            formRef.current.handleSubmit();
        }
    };
    const handleCancel = () => {
        onCancel(false);
        setIsClear(true);
        setCoverPhoto(null);
        setAvatar(null);
    };

    //check value
    const checkChangeValue = (value1, value2) => {
        if (value1.name !== value2.name) {
            return false;
        }
        if (value1.dateOfBirth !== value2.dateOfBirth) {
            return false;
        }
        if (value1.gender !== value2.gender) {
            return false;
        }
        return true;
    };
    const handleSubmit = async (values) => {
        // console.log(values);
        setConfirmLoading(true);
        try {
            if (!checkChangeValue(values, refInitValue.current)) {
                const { name, dateOfBirth, gender } = values;
                await meApi.updateProfile(name, dateOfBirth, gender);
            }
            if (coverPhoto) {
                const frmData = new FormData();
                frmData.append('file', coverPhoto);
                const response = await meApi.updateCoverPhoto(frmData);
                const param = {
                    name: response.filename,
                    url: response.publicUrl,
                };
                dispatch(setCoverPhotoProfile(param));
            }
            if (avatar) {
                const frmData = new FormData();
                frmData.append('file', avatar);
                const response = await meApi.updateAvatar(frmData);
                const param = {
                    name: response.filename,
                    url: response.publicUrl,
                };
                dispatch(setAvatarProfile(param));
            }
            setIsClear(true);
        } catch (error) {
            // console.log(error);
        }
        setConfirmLoading(false);

        if (onCancel) {
            onCancel();
        }
    };

    useEffect(() => {
        if (isVisible) {
            // console.log(isVisible);
            setIsClear(false);
            refInitValue.current = {
                name: user.name,
                username: user.username,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
            };
            // console.log(refInitValue.current);
        }
        // eslint-disable-next-line
    }, [isVisible]);

    return (
        <Modal
            title="Cập nhật thông tin"
            visible={isVisible}
            onOk={handleOke}
            onCancel={handleCancel}
            width={400}
            bodyStyle={{ padding: 0 }}
            okText="Cập nhật"
            cancelText="Hủy"
            centered
            confirmLoading={confirmLoading}
        >
            <div className="profile-update_wrapper">
                <div className="profile-update_img">
                    <div className="profile-update_cover-photo">
                        <div className="profile-update_upload">
                            <UploadConverPhoto
                                coverPhoto={user.coverPhoto.url}
                                getFile={handleGetCoverPhoto}
                                isClear={isClear}
                            />
                        </div>

                        <div className="profile-update_avatar">
                            <UploadAvatar
                                avatar={user.avatar.url}
                                getFile={handleGetAvatar}
                                isClear={isClear}
                            />
                        </div>
                    </div>
                </div>

                <div className="profile-update_info">
                    <Formik
                        innerRef={formRef}
                        initialValues={{
                            name: user.name,
                            username: user.username,
                            dateOfBirth: user.dateOfBirth,
                            gender: user.gender ? 1 : 0,
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={Yup.object().shape({
                            name: Yup.string()
                                .required('Tên không được bỏ trống')
                                .max(100, 'Tên tối đa 100 kí tự'),
                        })}
                        enableReinitialize={true}
                    >
                        {(formikProps) => {
                            return (
                                <Form>
                                    <Row gutter={[0, 8]}>
                                        <Col span={24}>
                                            <p>Tên hiển thị</p>
                                            <FastField
                                                name="name"
                                                component={InputFieldNotTitle}
                                                type="text"
                                                maxLength={100}
                                            ></FastField>
                                            <p
                                                style={{
                                                    color: '#999999',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                Sử dụng tên thật để bạn bè dễ
                                                dàng nhận diện hơn
                                            </p>
                                        </Col>

                                        <Col span={24}>
                                            <p>Tài khoản đăng ký</p>
                                            <FastField
                                                name="username"
                                                component={InputFieldNotTitle}
                                                type="text"
                                                disabled={true}
                                            ></FastField>
                                        </Col>

                                        <Col span={24}>
                                            <p>Ngày sinh</p>
                                            <FastField
                                                name="dateOfBirth"
                                                component={DateOfBirthField}
                                            ></FastField>
                                        </Col>

                                        <Col span={24}>
                                            <p>Giới tính</p>
                                            <FastField
                                                name="gender"
                                                component={GenderRadioField}
                                            ></FastField>
                                        </Col>
                                    </Row>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </Modal>
    );
}

export default ModalUpdateProfile;

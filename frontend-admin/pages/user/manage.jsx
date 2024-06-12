import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Empty } from 'antd'
import axios from 'axios'

import Header from '@/components/Header'
import Heading from '@/components/Heading'
import UserAdmin from '@/components/UserManagementPage/UserAdmin'
import Router from 'next/router'

import * as actions from '../../store/actions';
const UserManagementPage = () => {

    return (
        <div className="product-manager">
        <Header title="Quản lý người dùng" />
        <div className="wrapper manager-box">
            <Heading title="Tất cả người dùng" />
            <div className="wrapper-user-admin table-responsive">
                <table className='table user-admin w-100'>
                    <thead className="w-100 align-middle text-center">
                        <tr className="fs-6 w-100">
                            <th title='Tên sản phẩm' className="name col-infor-user">
                                STT
                            </th>
                            <th title='Tên' className="col-price">Tên</th>
                            {/* <th title='Tồn kho' className="col-quantity">Tồn kho</th> */}
                            <th title="Ngày sinh" className="col-createAt">Ngày sinh</th>
                            {/* <th title="Trạng thái" className="col-state">Trạng thái</th> */}
                            <th title="Tuổi" className="col-detail">Tuổi</th>
                            <th title="Email" className="col-action manipulation">Email</th>
                            <th title="Địa chỉ" className="col-action manipulation">Địa chỉ</th>
                            <th title="Role" className="col-action manipulation">Role</th>
                            <th title="Trạng thái" className="col-action manipulation">Trạng thái</th>
                        </tr>

                    </thead>
                    <tbody>
                        <UserAdmin/>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
}

export default UserManagementPage
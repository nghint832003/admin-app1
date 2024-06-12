import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { swalert, swtoast } from "@/mixins/swal.mixin";
import { FaTrash, FaPencilAlt } from "react-icons/fa"
import { Switch } from 'antd';
import Swal from "sweetalert2";
import { homeAPI } from "@/config";

const UserAdmin = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const result = await axios.get(`${homeAPI}/users/`);
                setUserList(result.data);
            } catch (err) {
                console.log(err);
            }
        };

        getAllUsers();
    }, []);

    const refreshUserTable = async () => {
        try {
            const result = await axios.get(`${homeAPI}/users`);
            setUserList(result.data);
        } catch (err) {
            console.log(err);
        }
    };

    

    const convertTime = (created_at) => {
        const date = new Date(created_at);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // tháng (giá trị từ 0 đến 11, nên cộng thêm 1)
        const day = date.getDate(); // ngày trong tháng
        const hours = date.getHours(); // giờ
        const minutes = date.getMinutes(); // phút
        const seconds = date.getSeconds(); // giây
        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        return (
            <>
                {formattedDate} <br /> {formattedTime}
            </>
        )
    }

    return (
        userList.map((user, index) => (
            <tr key={user.id}>
                <td className='col-infor-user'>
                    <p className="name">
                        {index+1}
                    </p>
                </td>
                <td className='col-infor-user'>
                    <p className="name">
                        {user.nameUser}
                    </p>
                </td>
                <td className="text-danger fw-bold col-price">
                    <p className='d-flex align-items-center justify-content-center'>
                        {convertTime(user.birthday)}
                    </p>
                </td>
                <td className="text-danger fw-bold col-price">
                    <p className='d-flex align-items-center justify-content-center'>
                        {user.age}
                    </p>
                </td>
                <td className="text-danger fw-bold col-price">
                    <p className='d-flex align-items-center justify-content-center'>
                        {user.email}
                    </p>
                </td>
                <td className="text-danger fw-bold col-price">
                    <p className='d-flex align-items-center justify-content-center'>
                        {user.address}
                    </p>
                </td>
                <td className="text-danger fw-bold col-price">
                    <p className='d-flex align-items-center justify-content-center'>
                        {user.role}
                    </p>
                </td>
                <td className="text-danger fw-bold col-price">
                    <p className='d-flex align-items-center justify-content-center'>
                        {user.type}
                    </p>
                </td>
                
                <td className="col-actions">
                    <button onClick={() => handleEditUser(user.id, user)} className="btn btn-primary">
                        <FaPencilAlt />
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="btn btn-danger">
                        <FaTrash />
                    </button>
                </td>
            </tr>
        ))
    );
}

export default UserAdmin;

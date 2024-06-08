import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

import Heading from '../Heading';
import { swtoast, swalert } from '@/mixins/swal.mixin';
import { homeAPI } from '@/config';

// const fakeColourList = [
//     { colour_id: 1, colour_name: "Trắng" },
//     { colour_id: 1, colour_name: "Đen" },
//     { colour_id: 1, colour_name: "Xanh" },
// ]

const ColourManage = () => {
    const [colourList, setColourList] = useState([]);

    useEffect(() => {
        const getColourList = async () => {
            try {
                const result = await axios.get(`${homeAPI}/product-colors`);
                setColourList(result.data);
            } catch (err) {
                console.log(err);
                // setColourList(fakeColourList)
            }
        };
        getColourList();
    }, []);

    const refreshColourTable = async () => {
        try {
            const result = await axios.get(`${homeAPI}/product-colors`);
            setColourList(result.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleCreateColour = async () => {
        const { value: newColour } = await Swal.fire({
            title: 'Nhập tên màu mới',
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'Tên màu mới..',
            showCloseButton: true,
        });
        if (!newColour) {
            swtoast.fire({
                text: "Thêm màu mới không thành công!"
            });
            return;
        }
        if (newColour) {
            try {
                await axios.post(`${homeAPI}/product-colors`, { color: newColour });
                refreshColourTable();
                swtoast.success({
                    text: 'Thêm màu mới thành công!'
                });
            } catch (e) {
                console.log(e);
                swtoast.error({
                    text: 'Xảy ra lỗi khi thêm màu mới, vui lòng thử lại!'
                });
            }
        }
    };

    const handleEditColour = async (id, currentColour) => {
        const { value: newColour } = await Swal.fire({
            title: 'Chỉnh sửa tên màu',
            input: 'text',
            inputLabel: '',
            inputValue: currentColour,
            inputPlaceholder: 'Tên màu mới..',
            showCloseButton: true,
        });
        if (!newColour || newColour === currentColour) {
            swtoast.fire({
                text: "Tên màu không thay đổi!"
            });
            return;
        }
        if (newColour) {
            try {
                await axios.put(`${homeAPI}/product-colors/${id}`, { color: newColour });
                refreshColourTable();
                swtoast.success({
                    text: 'Chỉnh sửa màu thành công!'
                });
            } catch (e) {
                console.log(e);
                swtoast.error({
                    text: 'Xảy ra lỗi khi chỉnh sửa màu, vui lòng thử lại!'
                });
            }
        }
    };

    const handleDeleteColour = async (id) => {
        swalert
            .fire({
                title: "Xóa màu",
                icon: "warning",
                text: "Bạn muốn xóa màu này?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(`${homeAPI}/product-colors/${id}`);
                        refreshColourTable();
                        swtoast.success({
                            text: 'Xóa màu thành công!'
                        });
                    } catch (err) {
                        console.log(err);
                        swtoast.error({
                            text: 'Xảy ra lỗi khi xóa màu, vui lòng thử lại!'
                        });
                    }
                }
            });
    };

    return (
        <div className="catalog-management-item">
            <Heading title="Tất cả màu" />
            <div className='create-btn-container'>
                <button className='btn btn-dark btn-sm' onClick={handleCreateColour}>Tạo màu</button>
            </div>
            <div className='table-container' style={{ height: "220px" }}>
                <table className='table table-hover table-bordered'>
                    <thead>
                        <tr>
                            <th className='text-center'>STT</th>
                            <th>Tên màu</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colourList.map((colour, index) => (
                            <tr key={index}>
                                <td className='text-center'>{index + 1}</td>
                                <td>{colour.color}</td>
                                <td className="col-action manipulation">
                                    <FaPencilAlt
                                        style={{ cursor: "pointer" }}
                                        title="Chỉnh sửa"
                                        className="text-primary"
                                        onClick={() => handleEditColour(colour.id, colour.color)}
                                    />
                                    <FaTrash
                                        style={{ cursor: "pointer" }}
                                        title="Xóa"
                                        className="text-danger"
                                        onClick={() => handleDeleteColour(colour.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ColourManage;

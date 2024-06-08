import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

import Heading from '../Heading';
import { swtoast, swalert } from '@/mixins/swal.mixin';
import { homeAPI } from '@/config';

// const fakeSizeList = [
//     { size_id: 1, size_name: "S" },
//     { size_id: 2, size_name: "M" },
//     { size_id: 3, size_name: "L" },
// ]

const SizeManage = () => {
    const [sizeList, setSizeList] = useState([]);

    useEffect(() => {
        const getSizeList = async () => {
            try {
                const result = await axios.get(`${homeAPI}/product-sizes`);
                setSizeList(result.data);
            } catch (err) {
                console.log(err);
                // setSizeList(fakeSizeList)
            }
        };
        getSizeList();
    }, []);

    const refreshSizeTable = async () => {
        try {
            const result = await axios.get(`${homeAPI}/product-sizes`);
            setSizeList(result.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleCreateSize = async () => {
        const { value: newSize } = await Swal.fire({
            title: 'Nhập tên size mới',
            input: 'text',
            inputLabel: '',
            inputPlaceholder: 'Tên size mới..',
            showCloseButton: true,
        });
        if (!newSize) {
            swtoast.fire({
                text: "Thêm size mới không thành công!"
            });
            return;
        }
        if (newSize) {
            try {
                await axios.post(`${homeAPI}/product-sizes`, { size: newSize });
                refreshSizeTable();
                swtoast.success({
                    text: 'Thêm size mới thành công!'
                });
            } catch (e) {
                console.log(e);
                swtoast.error({
                    text: 'Xảy ra lỗi khi thêm size mới, vui lòng thử lại!'
                });
            }
        }
    };

    const handleEditSize = async (id, currentSize) => {
        const { value: newSize } = await Swal.fire({
            title: 'Chỉnh sửa tên size',
            input: 'text',
            inputLabel: '',
            inputValue: currentSize,
            inputPlaceholder: 'Tên size mới..',
            showCloseButton: true,
        });
        if (!newSize || newSize === currentSize) {
            swtoast.fire({
                text: "Tên size không thay đổi!"
            });
            return;
        }
        if (newSize) {
            try {
                await axios.put(`${homeAPI}/product-sizes/${id}`, { size: newSize });
                refreshSizeTable();
                swtoast.success({
                    text: 'Chỉnh sửa size thành công!'
                });
            } catch (e) {
                console.log(e);
                swtoast.error({
                    text: 'Xảy ra lỗi khi chỉnh sửa size, vui lòng thử lại!'
                });
            }
        }
    };

    const handleDeleteSize = async (id) => {
        swalert
            .fire({
                title: "Xóa size",
                icon: "warning",
                text: "Bạn muốn xóa size này?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(`${homeAPI}/product-sizes/${id}`);
                        refreshSizeTable();
                        swtoast.success({
                            text: 'Xóa size thành công!'
                        });
                    } catch (err) {
                        console.log(err);
                        swtoast.error({
                            text: 'Xảy ra lỗi khi xóa size, vui lòng thử lại!'
                        });
                    }
                }
            });
    };

    return (
        <div className="catalog-management-item">
            <Heading title="Tất cả size" />
            <div className='create-btn-container'>
                <button className='btn btn-dark btn-sm' onClick={handleCreateSize}>Tạo size</button>
            </div>
            <div className='table-container' style={{ height: "220px" }}>
                <table className='table table-hover table-bordered'>
                    <thead>
                        <tr>
                            <th className='text-center'>STT</th>
                            <th>Tên size</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sizeList.map((size, index) => (
                            <tr key={index}>
                                <td className='text-center'>{index + 1}</td>
                                <td>{size.size}</td>
                                <td className="col-action manipulation">
                                    <FaPencilAlt
                                        style={{ cursor: "pointer" }}
                                        title="Chỉnh sửa"
                                        className="text-primary"
                                        onClick={() => handleEditSize(size.id, size.size)}
                                    />
                                    <FaTrash
                                        style={{ cursor: "pointer" }}
                                        title="Xóa"
                                        className="text-danger"
                                        onClick={() => handleDeleteSize(size.id)}
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

export default SizeManage;

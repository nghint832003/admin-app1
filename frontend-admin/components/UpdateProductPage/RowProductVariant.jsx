import React from 'react';
import axios from 'axios';
import { InputNumber } from 'antd';
import { FaTrash } from "react-icons/fa";
import UploadImageBox from '@/components/UploadImageBox';
import { swalert, swtoast } from "@/mixins/swal.mixin";
import PropTypes from 'prop-types';

// Helper function to generate the variant URL
const getVariantUrl = (product_id, variantId = '') => {
    return `http://localhost:8000/api/products/${product_id}/variants/${variantId}`;
};

const RowProductVariant = ({ index, product_id, productVariantList, setProductVariantList, setIsLoading, refreshPage }) => {

    const handleQuantityChange = (value) => {
        let productVariantListClone = [...productVariantList];
        productVariantListClone[index].quantity = value;
        setProductVariantList(productVariantListClone);
    };

    const handleDelete = async () => {
        swalert
            .fire({
                title: "Xóa biến thể sản phẩm",
                icon: "warning",
                text: "Bạn muốn xóa biến thể sản phẩm này?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    setIsLoading(true);
                    try {
                        const variantId = productVariantList[index].productVariantId;
                        await axios.delete(getVariantUrl(product_id, variantId));
                        refreshPage();
                        swtoast.success({
                            text: 'Xóa biến thể sản phẩm thành công!'
                        });
                    } catch (err) {
                        console.log(err);
                        swtoast.error({
                            text: 'Xảy ra lỗi khi xóa biến thể sản phẩm vui lòng thử lại!'
                        });
                    } finally {
                        setIsLoading(false);
                    }
                }
            });
    };

    return (
        <tr className='row-product-variant'>
            <td className='col-colour text-center'>
                {productVariantList[index].color}
            </td>
            <td className='col-size text-center'>
                {productVariantList[index].size}
            </td>
            <td className='col-quantity text-center'>
                <InputNumber
                    value={productVariantList[index].quantity}
                    style={{ width: '100%' }}
                    onChange={handleQuantityChange}
                />
            </td>
            <td className="col-image">
                <UploadImageBox
                    index={index}
                    productVariantList={productVariantList}
                    setProductVariantList={setProductVariantList}
                />
            </td>
            <td className='col-delete text-center'>
                <FaTrash style={{ cursor: "pointer" }} title='Xóa' className="text-danger" onClick={handleDelete} />
            </td>
        </tr>
    );
};

RowProductVariant.propTypes = {
    index: PropTypes.number.isRequired,
    product_id: PropTypes.number.isRequired,
    productVariantList: PropTypes.array.isRequired,
    setProductVariantList: PropTypes.func.isRequired,
    setIsLoading: PropTypes.func.isRequired,
    refreshPage: PropTypes.func.isRequired,
};

export default RowProductVariant;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, InputNumber, Empty } from 'antd';
import Header from '@/components/Header';
import Category from '@/components/Category';
import CKeditor from '@/components/CKEditor';
import RowProductVariant from '@/components/UpdateProductPage/RowProductVariant';
import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config';

const UpdateProductPage = () => {
    const { id } = useParams();
    // const navigate = useNavigate();

    const [productField, setProductField] = useState({
        productId: '',
        productName: '',
        categoryId: '',
        categoryName: '',
        price: 0,
        description: ''
    });

    const [editorLoaded, setEditorLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [productVariantList, setProductVariantList] = useState([]);
    const [rowProductVariant, setRowProductVariant] = useState([]);

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    useEffect(() => {
        const rows = productVariantList.map((variant, index) => (
            <RowProductVariant
                key={index}
                index={index}
                productVariantList={productVariantList}
                setProductVariantList={setProductVariantList}
                setIsLoading={setIsLoading}
                refreshPage={refreshPage}
            />
        ));
        setRowProductVariant(rows);
    }, [productVariantList]);

    const fetchProduct = async () => {
        try {
            setIsLoading(true);
            const result = await axios.get(`${homeAPI}/products/${id}`);
            setProductField({
                productId: result.data.id,
                productName: result.data.title,
                categoryId: result.data.category_id,
                categoryName: result.data.category_name,
                price: result.data.price,
                description: result.data.description
            });
            setProductVariantList(await convertProductVariantList(result.data.product_variant_list));
        } catch (err) {
            console.log("Something went wrong", err);
            navigate("/404");
        } finally {
            setIsLoading(false);
        }
    };

    const convertProductVariantList = async (productVariants) => {
        const variants = await Promise.all(productVariants.map(async (variant) => {
            const fileList = await Promise.all(variant.product_images.map(async ({ path }) => {
                const response = await fetch(path);
                const blob = await response.blob();
                const name = path.slice(-40, -4);
                const file = new File([blob], name, { type: blob.type });
                return {
                    uid: name,
                    name: name,
                    url: path,
                    originFileObj: file
                };
            }));
            return {
                productVariantId: variant.product_variant_id,
                colourId: variant.colour_id,
                colourName: variant.colour_name,
                sizeId: variant.size_id,
                sizeName: variant.size_name,
                quantity: variant.quantity,
                fileList
            };
        }));
        return variants;
    };

    const refreshPage = async () => {
        if (id) {
            await fetchProduct();
        }
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                setIsLoading(true);
                const updateProduct = {
                    id: productField.productId,
                    title: productField.productName,
                    category_id: productField.categoryId,
                    price: productField.price,
                    description: productField.description
                };
                await axios.put(`${homeAPI}/product/update`, updateProduct);

                await Promise.all(productVariantList.map(async (variant) => {
                    const data = new FormData();
                    data.append('product_variant_id', variant.productVariantId);
                    data.append('quantity', variant.quantity);
                    variant.fileList.forEach(file => {
                        data.append('product_images', file.originFileObj);
                    });
                    await axios.put(`${homeAPI}/product-variant/update`, data, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }));

                swtoast.success({ text: 'Cập nhật sản phẩm thành công!' });
                refreshPage();
            } catch (error) {
                console.log("Failed to update product:", error);
                swtoast.error({ text: 'Cập nhật sản phẩm thất bại!' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const validate = () => {
        const { productName, categoryId, price, description } = productField;
        if (!productName) {
            swtoast.error({ text: 'Tên sản phẩm không được bỏ trống' });
            return false;
        }
        if (!categoryId) {
            swtoast.error({ text: 'Danh mục sản phẩm không được bỏ trống' });
            return false;
        }
        if (!price) {
            swtoast.error({ text: 'Giá sản phẩm không được bỏ trống' });
            return false;
        }
        if (!description) {
            swtoast.error({ text: 'Mô tả sản phẩm không được bỏ trống' });
            return false;
        }
        if (!productVariantList.length) {
            swtoast.error({ text: 'Sản phẩm phải có ít nhất 1 biến thể' });
            return false;
        }
        for (const variant of productVariantList) {
            if (!variant.quantity) {
                swtoast.error({ text: 'Biến thể sản phẩm phải có ít nhất một tồn kho' });
                return false;
            }
            if (!variant.fileList.length) {
                swtoast.error({ text: 'Biến thể sản phẩm phải có ít nhất một ảnh' });
                return false;
            }
        }
        return true;
    };

    const changeProductFieldHandler = (e) => {
        setProductField({
            ...productField,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className='container'>
            <h1>Edit Product</h1>
            <form onSubmit={updateProduct}>
                <div className="mb-3 mt-3">
                    <label className="form-label">Product ID:</label>
                    <Input type="text" className="form-control" name="productId" value={productField.productId} disabled />
                </div>
                <div className="mb-3 mt-3">
                    <label className="form-label">Product Name:</label>
                    <Input type="text" className="form-control" name="productName" value={productField.productName} onChange={changeProductFieldHandler} />
                </div>
                <div className="mb-3 mt-3">
                    <label className="form-label">Category:</label>
                    <Category setCategoryId={(categoryId) => setProductField(prev => ({ ...prev, categoryId }))} categoryName={productField.categoryName} setCategoryName={(categoryName) => setProductField(prev => ({ ...prev, categoryName }))} />
                </div>
                <div className="mb-3 mt-3">
                    <label className="form-label">Price:</label>
                    <InputNumber className="form-control" name="price" value={productField.price} onChange={(value) => setProductField(prev => ({ ...prev, price: value }))} style={{ width: '100%' }} />
                </div>
                <div className="mb-3 mt-3">
                    <label className="form-label">Description:</label>
                    <CKeditor
                        name="description"
                        data={productField.description}
                        onChange={(data) => setProductField(prev => ({ ...prev, description: data }))}
                        editorLoaded={editorLoaded}
                    />
                </div>
                <div>
                    <label className="form-label">Product Variants:</label>
                    <table className="table w-100 table-hover align-middle table-bordered">
                        <thead>
                            <tr className='row-product-variant'>
                                <th className='col-colour text-center'>Color</th>
                                <th className='col-size text-center'>Size</th>
                                <th className='col-quantity text-center'>Quantity</th>
                                <th className='col-image text-center'>Image</th>
                                <th className='col-delete text-center'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowProductVariant.length ? rowProductVariant : <tr><td colSpan={5}><Empty /></td></tr>}
                        </tbody>
                    </table>
                </div>
                <button type="submit" className="btn btn-primary">Update Product</button>
            </form>
            <div className='container d-flex justify-content-center'>
                <button className='btn btn-primary' onClick={() => navigate('/')}>Back To Home</button>
            </div>
            {isLoading && <Loading />}
        </div>
    );
};

export default UpdateProductPage;

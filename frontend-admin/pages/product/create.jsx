import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, InputNumber, Select, Empty } from 'antd';
import Header from '@/components/Header';
import ColourBox from '@/components/CreateProductPage/ColourBox';
import SizeBox from '@/components/CreateProductPage/SizeBox';
import CKeditor from '@/components/CKEditor';
import RowProductVariant from '@/components/CreateProductPage/RowProductVariant';
import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config';

const { Option } = Select;

const CreateProductPage = () => {
    const [productName, setProductName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [selectedColours, setSelectedColours] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [productVariantList, setProductVariantList] = useState([]);
    const [rowProductVariant, setRowProductVariant] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colours, setColours] = useState([]);
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${homeAPI}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        const fetchColours = async () => {
            try {
                const response = await axios.get(`${homeAPI}/product_colors`);
                setColours(response.data);
            } catch (error) {
                console.error('Failed to fetch colours:', error);
            }
        };

        const fetchSizes = async () => {
            try {
                const response = await axios.get(`${homeAPI}/product_sizes`);
                setSizes(response.data);
            } catch (error) {
                console.error('Failed to fetch sizes:', error);
            }
        };

        fetchCategories();
        fetchColours();
        fetchSizes();
    }, []);

    useEffect(() => {
        const productVariantListTemp = selectedColours.flatMap(colour => 
            selectedSizes.map(size => ({
                colorID: colour.id,
                color: colour.color,
                sizeID: size.id,
                size: size.size,
                quantity: '',
                fileList: [],
                price: 0,
                type: 'default'
            }))
        );
        setProductVariantList(productVariantListTemp);
    }, [selectedColours, selectedSizes]);

    useEffect(() => {
        const rowProductVariantTemp = productVariantList.map((_, i) => (
            <RowProductVariant
                key={i}
                index={i}
                productVariantList={productVariantList}
                setProductVariantList={setProductVariantList}
            />
        ));
        setRowProductVariant(rowProductVariantTemp);
    }, [productVariantList]);

    const createProduct = async () => {
        if (validate()) {
            try {
                setIsLoading(true);
                const newProduct = {
                    nameProduct: productName,
                    price,
                    categoryID: categoryId,
                    description
                };
                const result = await axios.post(`${homeAPI}/products`, newProduct);
                const productID = result.data.id;

                await Promise.all(productVariantList.map(async (variant) => {
                    const dataProductVariant = new FormData();
                    dataProductVariant.append('productID', productID);
                    dataProductVariant.append('colorID', variant.colorID);
                    dataProductVariant.append('sizeID', variant.sizeID);
                    dataProductVariant.append('quantity', variant.quantity);
                    dataProductVariant.append('price', variant.price);
                    dataProductVariant.append('type', variant.type);

                    for (let file of variant.fileList) {
                        const imageFormData = new FormData();
                        imageFormData.append('productID', productID);
                        imageFormData.append('url', file.originFileObj);
                        await axios.post(`${homeAPI}/product-images`, imageFormData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                    }

                    await axios.post(`${homeAPI}/product-variants`, dataProductVariant, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }));

                setIsLoading(false);
                swtoast.success({ text: 'Thêm sản phẩm thành công!' });
                clearPage();
            }
 catch (err) {
                console.error(err);
                setIsLoading(false);
                swtoast.error({ text: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
            }
        }
    };

    const validate = () => {
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
        return true;
    };

    const clearPage = () => {
        setProductName('');
        setCategoryId('');
        setCategoryName('');
        setPrice(0);
        setDescription('');
        setProductVariantList([]);
        setSelectedColours([]);
        setSelectedSizes([]);
    };

    return (
        <div className='create-product-page'>
            <Header title="Thêm sản phẩm" />
            <div className="create-product-form">
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-name' className="fw-bold">Tên sản phẩm:</label>
                        <Input
                            id='product-name' placeholder='Nhập tên sản phẩm'
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <label htmlFor='product-category' className="fw-bold">Danh mục:</label>
                        <Select
                            id='product-category'
                            style={{ width: '100%' }}
                            placeholder="Chọn danh mục"
                            value={categoryId}
                            onChange={(value, option) => {
                                setCategoryId(value);
                                setCategoryName(option.children);
                            }}
                        >
                            {categories.map(category => (
                                <Option key={category.id} value={category.id}>
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="col-6">
                        <label htmlFor='product-price' className="fw-bold">Giá sản phẩm:</label>
                        <br />
                        <InputNumber
                            id='product-price' placeholder='Nhập giá sản phẩm'
                            value={price === 0 ? null : price}
                            style={{ width: '100%' }}
                            onChange={setPrice}
                        />
                    </div>
                </div>
                <div className="description">
                    <label htmlFor='description' className="fw-bold">Mô tả sản phẩm:</label>
                    <div className="ckeditor-box">
                        <CKeditor
                            Placeholder={{ placeholder: "Mô tả ..." }}
                            name="description"
                            id="description"
                            form="add-product-form"
                            data={description}
                            onChange={(data) => setDescription(data)}
                            editorLoaded={editorLoaded}
                        />
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-6">
                        <ColourBox
                            colours={colours}
                            selectedColours={selectedColours}
                            setSelectedColours={setSelectedColours}
                        />
                    </div>
                    <div className="col-6">
                        <SizeBox
                            sizes={sizes}
                            selectedSizes={selectedSizes}
                            setSelectedSizes={setSelectedSizes}
                        />
                    </div>
                </div> */}
                {/* <div>
                    <label htmlFor='enter-name' className="fw-bold">Danh sách lựa chọn:</label>
                    <table className="table w-100 table-hover align-middle table-bordered">
                        <thead>
                            <tr className='row-product-variant'>
                                <th className='col-colour text-center' scope="col">Màu</th>
                                <th className='col-size text-center' scope="col">Size</th>
                                <th className='col-quantity text-center' scope="col">Tồn kho</th>
                                <th className='col-price text-center' scope="col">Giá</th>
                                <th className='col-type text-center' scope="col">Loại</th>
                                <th className='col-image text-center' scope="col">Ảnh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowProductVariant.length ? rowProductVariant : <tr><td colSpan={6}><Empty /></td></tr>}
                        </tbody>
                    </table>
                </div> */}
                <div className="btn-box text-left">
                    <button className='text-light bg-dark' onClick={createProduct}>
                        Thêm sản phẩm
                    </button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>
    );
};

export default CreateProductPage;

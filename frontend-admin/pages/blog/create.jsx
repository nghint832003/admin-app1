import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Upload, Button, Empty } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Header from '@/components/Header';
import CKeditor from '@/components/CKEditor';
import Loading from '@/components/Loading';
import { swtoast } from "@/mixins/swal.mixin";
import { homeAPI } from '@/config';

const CreateBlogPage = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [content, setContent] = useState('');
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    const createBlog = async () => {
        if (validate()) {
            try {
                setIsLoading(true);
                let formData = new FormData();
                formData.append('title', title);
                formData.append('image', image);
                formData.append('content', content);

                let result = await axios.post(`${homeAPI}/blog`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log(result.data);
                setIsLoading(false);
                swtoast.success({ text: 'Thêm blog thành công!' });
                clearPage();
            } catch (err) {
                console.log(err);
                setIsLoading(false);
                swtoast.error({ text: 'Xảy ra lỗi khi thêm blog, vui lòng thử lại!' });
            }
        }
    };

    const validate = () => {
        if (!title) {
            swtoast.error({ text: 'Tiêu đề không được bỏ trống' });
            return false;
        }
        // if (!image) {
        //     swtoast.error({ text: 'Hình ảnh không được bỏ trống' });
        //     return false;
        // }
        if (!content) {
            swtoast.error({ text: 'Nội dung không được bỏ trống' });
            return false;
        }
        return true;
    };

    const clearPage = () => {
        setTitle('');
        setImage(null);
        setContent('');
    };

    const handleImageChange = (info) => {
        if (info.file.status === 'done') {
            setImage(info.file.originFileObj);
        }
    };

    return (
        <div className='create-blog-page'>
            <Header title="Thêm Blog" />
            <div className="create-blog-form">
                <div className="row">
                    <div className="col-12">
                        <label htmlFor='blog-title' className="fw-bold">Tiêu đề:</label>
                        <Input
                            id='blog-title' placeholder='Nhập tiêu đề'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                        <label htmlFor='blog-image' className="fw-bold">Hình ảnh:</label>
                        <Upload
                            name='image'
                            listType='picture'
                            maxCount={1}
                            onChange={handleImageChange}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                        </Upload>
                    </div>
                </div>
                <div className="content mt-3">
                    <label htmlFor='blog-content' className="fw-bold">Nội dung:</label>
                    <div className="ckeditor-box">
                        <CKeditor
                            Placeholder={{ placeholder: "Nội dung ..." }}
                            name="content"
                            id="content"
                            form="add-blog-form"
                            data={content}
                            onChange={(data) => {
                                setContent(data);
                            }}
                            editorLoaded={editorLoaded}
                        />
                    </div>
                </div>
                <div className="btn-box text-left mt-3">
                    <Button type="primary" onClick={createBlog}>
                        Thêm Blog
                    </Button>
                </div>
            </div>
            {isLoading && <Loading />}
        </div>
    );
}

export default CreateBlogPage;

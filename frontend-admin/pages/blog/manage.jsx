import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Empty } from 'antd'
import axios from 'axios'

import Header from '@/components/Header'
import Heading from '@/components/Heading'
import BlogAdmin from '@/components/BlogManagementPage/BlogAdmin'
import Router from 'next/router'

const BlogManagementPage = () => {
    const [blogList, setBlogList] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchBlogList = async () => {
            try {
                const result = await axios.get('http://localhost:8000/api/blog')
                setBlogList(result.data)
            } catch (err) {
                console.log(err);
            }
        }
        fetchBlogList();
    }, [])

    const refreshBlogList = async () => {
        try {
            const result = await axios.get('http://localhost:8000/api/blog')
            setBlogList(result.data)
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="blog-manager">
            <Header title="Quản lý bài viết" />
            <div className="wrapper manager-box">
                <div className="to-add-blog-page">
                    <button onClick={() => Router.push('/blog/create')} className="btn btn-dark btn-sm">
                        Thêm bài viết
                    </button>
                </div>
                <Heading title="Tất cả bài viết" />
                <div className="wrapper-blog-admin table-responsive">
                    <table className='table product-admin w-100'>
                            <thead className="w-100 align-middle text-center">
                                <tr className="fs-6 w-100">
                                    <th title='Tiêu đề' className="name col-infor-product">
                                        Tiêu đề
                                    </th>
                                    <th title='Nội dung' className="col-content">Nội dung</th>
                                    <th title="Thời gian tạo" className="col-createAt">Ngày tạo</th>
                                    <th title="Thao tác" className="col-action manipulation">Thao tác</th>
                                </tr>
                            </thead>
                        </table>
                    {
                        blogList.length ?
                            blogList.map((blog, index) => {
                                return (
                                    <BlogAdmin
                                        key={index}
                                        blog_id={blog.id}
                                        title={blog.title}
                                        image={blog.image}
                                        content={blog.content}
                                        created_at={blog.created_at}
                                        updated_at={blog.updated_at}
                                        refreshBlogList={refreshBlogList}
                                    />
                                )
                            })
                            :
                            <table className="table w-100 table-hover align-middle table-bordered" style={{ height: "400px" }}>
                                <tbody>
                                    <tr><td colSpan={6}><Empty /></td></tr>
                                </tbody>
                            </table>
                    }
                </div>
            </div>
        </div>
    )
}

export default BlogManagementPage

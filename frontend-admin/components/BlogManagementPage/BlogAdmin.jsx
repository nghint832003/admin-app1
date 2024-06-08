import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { swalert, swtoast } from "@/mixins/swal.mixin";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { Switch } from "antd";
import Swal from "sweetalert2";

const BlogAdmin = (props) => {
  const [disabledInputState, setDisabledInputState] = useState(false);

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

  const handleUpdateState = async (state) => {
    // Implement updating state logic for blog posts
  };

  const handleDelete = async () => {
    Swal.fire({
        title: "Delete Blog Post",
        icon: "warning",
        text: "Are you sure you want to delete this blog post?",
        showCloseButton: true,
        showCancelButton: true,
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8000/api/blog/${props.blog_id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Blog post deleted successfully!',
                });
                // Refresh the blog post list
                props.refreshBlogList();
            } catch (error) {
                console.error("Error deleting blog post:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete blog post. Please try again!',
                });
            }
        }
    });
};

  return (

    <div className="table-responsive">
            <table className="table align-middle product-admin w-100">
                <tbody className='w-100 text-center'>
                    <tr className="w-100">
                        <td className='col-infor-product'>
                            <p className="title">
                                {props.title}
                            </p>
                            <img src={props.image} />
                        </td>
                        <td className=" fw-thin col-content">
                            <p className='d-flex align-items-center justify-content-center'>
                            <div dangerouslySetInnerHTML={{ __html: props.content }} />
                            </p>
                        </td>
                        <td className="col-createAt">
                            <p>{convertTime(props.created_at)}</p>
                        </td>
                        <td className="col-action manipulation">
                            <Link href={`/product/update/${props.product_id}`}>
                                Chỉnh sửa
                            </Link>
                            <br />
                            <FaTrash style={{ cursor: "pointer" }} title='Xóa' className="text-danger" onClick={() => handleDelete()} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
  );
};

export default BlogAdmin;

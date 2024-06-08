import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Link from 'next/link';
import { FaTrash, FaPencilAlt } from "react-icons/fa";

import Heading from "../Heading";
import CreateCategoryModal from "./CreateCategoryModal";
import { swtoast, swalert } from "@/mixins/swal.mixin";
import { homeAPI } from "@/config";

// const fakeListCategory = [
//     { category_id: 1, title: "Áo Nam", level: 1, parent_id: null },
//     { category_id: 2, title: "Quần Nam", level: 1, parent_id: null },
//     { category_id: 3, title: "Áo T-Shirt", level: 2, parent: "Áo Nam" },
//     { category_id: 4, title: "Áo Polo", level: 2, parent: "Áo Nam" },
//     { category_id: 5, title: "Quần Jeans", level: 2, parent: "Quần Nam" },
//     { category_id: 6, title: "Quần Short", level: 2, parent: "Quần Nam" },
// ];

const Category = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const result = await axios.get(`${homeAPI}/categories/`);
        setCategoryList(result.data);
      } catch (err) {
        console.log(err);
        // setCategoryList(fakeListCategory)
      }
    };

    getAllCategory();
  }, []);

  const refreshCategoryTable = async () => {
    try {
      const result = await axios.get(`${homeAPI}/categories`);
      setCategoryList(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateCategoryLevel1 = async () => {
    const { value: newCategory } = await Swal.fire({
      title: "Nhập tên danh mục mới",
      input: "text",
      inputLabel: "",
      inputPlaceholder: "Tên danh mục mới..",
      showCloseButton: true,
    });
    if (!newCategory) {
      swtoast.fire({
        text: "Thêm danh mục mới không thành công!",
      });
      return;
    }
    if (newCategory) {
      try {
        await axios.post(`${homeAPI}/categories`, {
          name: newCategory,
        });
        refreshCategoryTable();
        swtoast.success({
          text: "Thêm danh mục mới thành công!",
        });
      } catch (e) {
        console.log(e);
        swtoast.error({
          text: "Xảy ra lỗi khi thêm danh mục mới vui lòng thử lại!",
        });
      }
    }
  };

  const handleEditCategory = async (id, currentName) => {
    const { value: newName } = await Swal.fire({
      title: "Chỉnh sửa tên danh mục",
      input: "text",
      inputLabel: "",
      inputValue: currentName,
      inputPlaceholder: "Tên danh mục mới..",
      showCloseButton: true,
    });
    if (!newName || newName === currentName) {
      swtoast.fire({
        text: "Tên danh mục không thay đổi!",
      });
      return;
    }
    if (newName) {
      try {
        await axios.put(`${homeAPI}/categories/${id}`, {
          name: newName,
        });
        refreshCategoryTable();
        swtoast.success({
          text: "Chỉnh sửa danh mục thành công!",
        });
      } catch (e) {
        console.log(e);
        swtoast.error({
          text: "Xảy ra lỗi khi chỉnh sửa danh mục, vui lòng thử lại!",
        });
      }
    }
  };

  const handleDelete = async (id) => {
    swalert
      .fire({
        title: "Xóa danh mục",
        icon: "warning",
        text: "Bạn muốn xóa danh mục này?",
        showCloseButton: true,
        showCancelButton: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(`${homeAPI}/categories/${id}`);
            refreshCategoryTable();
            swtoast.success({
              text: "Xóa danh mục thành công!",
            });
          } catch (err) {
            console.log(err);
            swtoast.error({
              text: "Xảy ra lỗi khi xóa danh mục, vui lòng thử lại!",
            });
          }
        }
      });
  };

  return (
    <div className="catalog-management-item">
      <Heading title="Tất cả danh mục" />
      <div className="create-btn-container">
        <button
          className="btn btn-dark btn-sm"
          onClick={handleCreateCategoryLevel1}
        >
          Thêm danh mục
        </button>
        {/* <button className='btn btn-dark btn-sm' onClick={() => setIsModalOpen(true)}>Tạo danh mục level 2</button> */}
      </div>
      <div className="table-container" style={{ height: "520px" }}>
        <table className="table  table-hover table-bordered">
          <thead>
            <tr>
              <th className="text-center">STT</th>
              <th>Tên danh mục</th>
              <th>Hành động</th>
              
            </tr>
          </thead>
          <tbody>
            {categoryList.map((category, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>{category.name}</td>
                {/* <td>{category.level}</td>  */}
                <td className="col-action manipulation">
                  <br />
                  <FaPencilAlt
                    style={{ cursor: "pointer" }}
                    title="Chỉnh sửa"
                    className="text-primary"
                    onClick={() => handleEditCategory(category.id, category.name)}
                  />
                  <FaTrash
                    style={{ cursor: "pointer" }}
                    title="Xóa"
                    className="text-danger"
                    onClick={() => handleDelete(category.id)}
                  />
                </td>
                {/* <td>{category.parent}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateCategoryModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default Category;

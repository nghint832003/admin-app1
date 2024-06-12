import React from "react";
import axios from "axios";
import { InputNumber, Input, Switch } from "antd";
import { FaTrash } from "react-icons/fa";
import UploadImageBox from "@/components/UploadImageBox";
import { swalert, swtoast } from "@/mixins/swal.mixin";
import PropTypes from "prop-types";

// Helper function to generate the variant URL
const getVariantUrl = (ProductId, productVariantId = "") => {
  return `http://localhost:8000/api/products/${ProductId}/variants/${productVariantId}`;
};

const RowProductVariant = ({
  index,
  ProductId,
  productVariantList,
  setProductVariantList,
  setIsLoading,
  refreshPage,
}) => {
  const handleFieldChange = (field, value) => {
    const updatedProductVariantList = [...productVariantList];
    updatedProductVariantList[index][field] = value;
    setProductVariantList(updatedProductVariantList);
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
            const { productVariantId } = productVariantList[index];
            await axios.delete(getVariantUrl(ProductId, productVariantId));
            refreshPage();
            swtoast.success({
              text: "Xóa biến thể sản phẩm thành công!",
            });
          } catch (err) {
            console.error("Error deleting product variant:", err);
            swtoast.error({
              text: "Xảy ra lỗi khi xóa biến thể sản phẩm. Vui lòng thử lại!",
            });
          } finally {
            setIsLoading(false);
          }
        }
      });
  };

  return (
    <tr className="row-product-variant">
      <td className="col-colour text-center">
        {productVariantList[index].colorName}
      </td>
      <td className="col-size text-center">
        {productVariantList[index].sizeName}
      </td>
      <td className="col-quantity text-center">
        <InputNumber
          value={productVariantList[index].quantity}
          style={{ width: "100%" }}
          onChange={(value) => handleFieldChange("quantity", value)}
        />
      </td>
      <td className="col-price text-center">
        <InputNumber
          value={productVariantList[index].price}
          style={{ width: "100%" }}
          onChange={(value) => handleFieldChange("price", value)}
        />
      </td>
      <td className="col-price-sale text-center">
        <InputNumber
          value={productVariantList[index].priceSale}
          style={{ width: "100%" }}
          onChange={(value) => handleFieldChange("priceSale", value)}
        />
      </td>
      <td className="col-type text-center">
        <Input
          value={productVariantList[index].type}
          style={{ width: "100%" }}
          onChange={(e) => handleFieldChange("type", e.target.value)}
        />
      </td>
      <td className="col-sku text-center">
        <Input
          value={productVariantList[index].SKU}
          style={{ width: "100%" }}
          onChange={(e) => handleFieldChange("SKU", e.target.value)}
        />
      </td>
      <td className="col-is-active text-center">
        <Switch
          checked={productVariantList[index].isActive}
          onChange={(checked) => handleFieldChange("isActive", checked)}
        />
      </td>
      <td className="col-created-at text-center">
        {productVariantList[index].createdAt}
      </td>
      <td className="col-updated-at text-center">
        {productVariantList[index].updatedAt}
      </td>
      <td className="col-image">
        <UploadImageBox
          index={index}
          productVariantList={productVariantList}
          setProductVariantList={setProductVariantList}
        />
      </td>
      <td className="col-delete text-center">
        <FaTrash
          style={{ cursor: "pointer" }}
          title="Xóa"
          className="text-danger"
          onClick={handleDelete}
        />
      </td>
    </tr>
  );
};

RowProductVariant.propTypes = {
  index: PropTypes.number.isRequired,
  ProductId: PropTypes.number.isRequired,
  productVariantList: PropTypes.array.isRequired,
  setProductVariantList: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  refreshPage: PropTypes.func.isRequired,
};

export default RowProductVariant;

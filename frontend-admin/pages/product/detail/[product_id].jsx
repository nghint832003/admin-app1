import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { swalert, swtoast } from "@/mixins/swal.mixin";
import RowProductVariant from "@/components/DetailProductPage/RowProductVariant";

const DetailProductPage = () => {
    const router = useRouter();
    const { product_id } = router.query;
    const [product, setProduct] = useState({});
    const [productVariantList, setProductVariantList] = useState([]);
    const [rowProductVariant, setRowProductVariant] = useState([]);

    useEffect(() => {
        if (product_id) {
            fetchProduct(product_id);
        }
    }, [product_id]);

    useEffect(() => {
        setRowProductVariant(
          productVariantList.map((variant, index) => (
            <RowProductVariant
              key={index}
              index={index}
              productVariantList={productVariantList}
              setProductVariantList={setProductVariantList}
              setIsLoading={setIsLoading}
              refreshPage={refreshPage}
            />
          ))
        );
      }, [productVariantList]);

    const fetchProduct = async (product_id) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/products/${product_id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            // Handle error with SweetAlert2
            swtoast.error({ text: 'Error fetching product details. Please try again.' });
        }
    };

    const convertProductVariantList = async (productVariants) => {
        const variants = await Promise.all(
          productVariants.map(async (variant) => {
            const fileList = await Promise.all(
              variant.product_images.map(async ({ path }) => {
                const response = await fetch(path);
                const blob = await response.blob();
                const name = path.slice(-40, -4);
                const file = new File([blob], name, { type: blob.type });
                return {
                  uid: name,
                  name: name,
                  url: path,
                  originFileObj: file,
                };
              })
            );
            return {
              productVariantId: variant.id,
              colourId: variant.colorID,
              colourName: variant.color,
              sizeId: variant.sizeID,
              sizeName: variant.size,
              quantity: variant.quantity,
              fileList,
            };
          })
        );
        return variants;
      };


    return (
        <div className="detail-product-page">
            {product ? (
                <div className="product-details">
                    <h2>{product.nameProduct}</h2>
                    <p>Price: {product.price}</p>
                    <p>Description: {product.description}</p>
                    <p>Category: {product.categoryID}</p>
                    <p>Variant: {product.quantity}</p>
                    {/* Render other product details */}

                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default DetailProductPage;

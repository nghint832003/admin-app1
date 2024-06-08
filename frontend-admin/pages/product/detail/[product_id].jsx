import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { swalert, swtoast } from "@/mixins/swal.mixin";

const DetailProductPage = () => {
    const router = useRouter();
    const { productId } = router.query;
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (productId) {
            fetchProduct(productId);
        }
    }, [productId]);

    const fetchProduct = async (productId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/products/${productId}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            // Handle error with SweetAlert2
            swtoast.error({ text: 'Error fetching product details. Please try again.' });
        }
    };

    const handleDeleteProduct = async () => {
        swalert
            .fire({
                title: "Delete Product",
                icon: "warning",
                text: "Are you sure you want to delete this product?",
                showCloseButton: true,
                showCancelButton: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(`http://localhost:8000/api/products/${productId}`);
                        // Redirect to a different page after deletion
                        router.push('/products');
                        swtoast.success({ text: 'Product deleted successfully!' });
                    } catch (error) {
                        console.error('Error deleting product:', error);
                        swtoast.error({ text: 'Error deleting product. Please try again.' });
                    }
                }
            });
    };

    return (
        <div className="detail-product-page">
            {product ? (
                <div className="product-details">
                    <h2>{product.name}</h2>
                    <p>Price: {product.price}</p>
                    <p>Description: {product.description}</p>
                    {/* Render other product details */}
                    <button onClick={handleDeleteProduct}>Delete Product</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default DetailProductPage;


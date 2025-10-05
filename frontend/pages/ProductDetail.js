import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { formatPrice } from '../utils/formatPrice';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Không tìm thấy sản phẩm.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-8">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="product-detail p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div className="product-info-container">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-green-600 mb-4">{formatPrice(product.price)}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
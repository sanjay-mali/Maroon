import ProductForm from "@/components/product-form";

const AddProductPage = () => {
  return (
    <div>
      <h1>Add Product</h1>
      <ProductForm isEdit={false} />
    </div>
  );
};

export default AddProductPage;
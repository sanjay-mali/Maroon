import ProductForm from "@/components/product-form";

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <div className="flex items-center justify-center">
      <ProductForm isEdit={true} productId={id} />
    </div>
  );
}

import CategoryList from "@/components/CategoryList";

export const revalidate = 60;

export default async function CategoriesPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold main-text-color">Categories</h1>
      <div className="text-left content-frame p-6 text-gray-300 lg:mt-20 rounded-lg">
        <CategoryList />
      </div>
    </main>
  );
}

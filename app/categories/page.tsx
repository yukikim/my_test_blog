import CategoryList from "@/components/CategoryList";

export const revalidate = 60;

export default async function CategoriesPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Categories</h1>
      <CategoryList />
    </main>
  );
}

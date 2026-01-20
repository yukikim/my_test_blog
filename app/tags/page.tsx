import TagList from "@/components/TagList";

export const revalidate = 60;

export default async function TagsPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-400">Tags</h1>
      <div className="text-left bg-gray-700 p-6 text-gray-300 lg:mt-20 rounded-lg">
      <TagList />
      </div>
    </main>
  );
}

import TagList from "@/components/TagList";

export const revalidate = 60;

export default async function TagsPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold main-text-color">Tags</h1>
      <div className="text-left content-frame p-6 text-gray-300 lg:mt-20 rounded-lg">
      <TagList />
      </div>
    </main>
  );
}

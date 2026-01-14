import SkillMap from "@/components/SkillMap";

export const revalidate = 60;

export default function SkillsPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Skills</h1>
      <SkillMap />
    </main>
  );
}

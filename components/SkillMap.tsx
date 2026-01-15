type Skill = { name: string; level: number; years?: number; };

type Props = {
  title?: string;
  skills?: Skill[];
};

const defaultSkills: Skill[] = [
  { name: "TypeScript", level: 5, years: 5 },
  { name: "React / Next.js", level: 5, years: 5 },
  { name: "Node.js", level: 4, years: 6 },
  { name: "Tailwind CSS", level: 4, years: 3 },
  { name: "microCMS", level: 3, years: 2 },
];

export default function SkillMap({ title = "Skills", skills = defaultSkills }: Props) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <ul className="space-y-3">
        {skills.map((s) => (
          <li key={s.name} className="rounded border p-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="font-medium">{s.name}</span>
              <span className="text-xs text-zinc-500">Lv.{s.level}{s.years ? ` / ${s.years} yrs` : ""}</span>
            </div>
            <div className="mt-2 h-2 w-full rounded bg-zinc-200">
              <div
                className="h-2 rounded bg-teal-500"
                style={{ width: `${(Math.min(Math.max(s.level, 0), 5) / 5) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

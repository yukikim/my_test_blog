type Skill = { name: string; level: number; years?: number; };

type Props = {
  title?: string;
  skills?: Skill[];
};

const defaultSkills: Skill[] = [
  { name: "javascript", level: 9, years: 7 },
  { name: "TypeScript", level: 5, years: 2 },
  { name: "Node.js", level: 8, years: 6 },
  { name: "React", level: 8, years: 5 },
  { name: "Next.js", level: 7, years: 6 },
  { name: "Vue / Nuxt.js", level: 4, years: 2 },
  { name: "PHP", level: 4, years: 3 },
  { name: "Python", level: 2, years: 1 },
  { name: "Bootstrap CSS", level: 7, years: 4 },
  { name: "Tailwind CSS", level: 4, years: 2 },
  { name: "HTML5", level: 7, years: 5 },
  { name: "CSS3", level: 7, years: 5 },
  { name: "SSH", level: 6, years: 6 },
  { name: "Vim", level: 6, years: 7 },
  { name: "Nginx", level: 5, years: 5 },
  { name: "microCMS", level: 2, years: 1 },
  { name: "Vercel", level: 2, years: 1 },
  { name: "AWS", level: 2, years: 3 },
  { name: "illustrator", level: 9, years: 10 },
  { name: "Photoshop", level: 9, years: 10 },
  { name: "Figma", level: 1, years: 2 },
];

export default function SkillMap({ title = "Skills", skills = defaultSkills }: Props) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-gray-300">{title}<br /><span className="text-sm font-normal text-gray-300">習得したスキル(習得度は大凡の値です)</span></h2>
      <ul className="space-y-3">
        {skills.map((s) => (
          <li key={s.name} className="rounded p-2 content-frame-in mb-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{s.name}</span>
              <span className="text-xs text-zinc-900">Lv.{s.level}{s.years ? ` / ${s.years} yrs` : ""}</span>
            </div>
            <div className="mt-1 h-2 w-full rounded bg-zinc-200">
              <div
                className="h-2 rounded bg-theme-primary"
                style={{ width: `${(Math.min(Math.max(s.level, 0), 10) / 10) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

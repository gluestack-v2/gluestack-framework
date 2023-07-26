'use client';
import Link from 'next/link';
export const Sidebar = ({ sidebarJson }: any) => {
  const sideJsonParse = sidebarJson ? JSON.parse(sidebarJson) : {};
  const instanceNames = Object.values(sideJsonParse).map(
    (arr) => arr[0].instance
  );
  const pluginNames = Object.keys(sideJsonParse);

  return (
    <aside className="bg-slate-500 h-full flex flex-col">
      <p className="px-2 py-4 text-white w-full">List of Plugins</p>
      <ul className="w-full flex-1 flex flex-col">
        {pluginNames.map((instanceName: string) => {
          const pluginSlug = instanceName.replace('/', '-');
          return (
            <li
              key={pluginSlug}
              className="list-none w-full active:bg-slate-700 hover:bg-slate-600 text-white  px-2 py-4"
            >
              <Link href={`/Plugins/${pluginSlug}`} className="w-full h-full">
                {pluginSlug}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

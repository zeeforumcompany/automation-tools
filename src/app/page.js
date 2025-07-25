import fetchCompanyAndSlugData from "@/helpers/router";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const className = "block w-full bg-yellow-100 py-2 px-4 rounded-lg hover:bg-blue-100 mb-1";

  const pages = fetchCompanyAndSlugData();

  return (
    <div className="w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold">Automation Tools</h1>
      <ul className="mt-4 space-y-2">
        <li className="">
          {pages.map((page) => (
            <Link key={page.slug} href={`/${page.company}/${page.slug}`} className={className}>
              {page.text}
            </Link>
          ))}
        </li>
      </ul>
    </div>
  );
}

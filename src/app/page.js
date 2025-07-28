import fetchCompanyAndSlugData from "@/helpers/router";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const className = "block w-full bg-yellow-100 py-2 px-4 rounded-lg hover:bg-blue-100 mb-1";

  const pages = fetchCompanyAndSlugData();

  let label = "";

  return (
    <>
      <h1 className="text-4xl font-bold">Automation Tools</h1>
      <ul className="mt-4 space-y-2">
        <li className="">
          {pages.map((page) => {
            let heading = "";
            if (page.label && page.label !== undefined && page.label !== label) {
              heading = <h3 className="font-bold my-2 text-xl">{page.label}</h3>;
              label = page.label;
            }

            let url = `/${page.company}/${page.slug}`;

            return (
              <div key={url}>
                {heading}
                <Link href={url} className={className}>
                  {page.text}
                </Link>
              </div>
            );
          })}
        </li>
      </ul>
    </>
  );
}

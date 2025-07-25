import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const className = "block w-full bg-yellow-100 py-2 px-4 rounded-lg hover:bg-blue-100 mb-1";

  return (
    <div className="w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold">Automation Tools</h1>
      <ul className="mt-4 space-y-2">
        <li className="">
          <Link href="/nice/postman" className={className}>Postman</Link>
          <Link href="/nice/find-new-tags" className={className}>Compare New Tags with API Tags</Link>
          <Link href="/nice/dispositions" className={className}>Dispositions (To JSON)</Link>
          <Link href="/nice/hours-of-operation" className={className}>Hours of Operation (To JSON)</Link>
        </li>
      </ul>
    </div>
  );
}

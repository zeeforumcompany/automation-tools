import Postman from "@/components/postman";
import FindNewTags from "@/components/find-new-tags";
import Dispositions from "@/components/dispositions";
import HoursOfOperation from "@/components/hours-of-operation";
import fetchCompanyAndSlugData from "@/helpers/router";

export async function generateStaticParams() {
  const data = fetchCompanyAndSlugData();

  // Map your data to the expected format for generateStaticParams
  const params = data.map((item) => ({
    company: item.company,
    slug: item.slug,
  }));

  return params;
}

export default async function NiceApp({ params }) {
	let { company, slug } = await params;
	// let slug = usePathname();
	// slug = slug ? slug.split('/').filter(Boolean) : [];
	// slug = slug.length > 0 ? slug[slug.length - 1] : null;

	let content;

	if (!slug) {
		content = <p>Loading...</p>;
	} else if (slug === 'postman') {
		content = <Postman />;
	} else if (slug === 'find-new-tags') {
		content = <FindNewTags />;
	} else if (slug === 'dispositions') {
		content = <Dispositions />;
	} else if (slug === 'hours-of-operation') {
		content = <HoursOfOperation />;

	} else {
		content = <p>404 - Page Not Found</p>;
	}

  return content;
}

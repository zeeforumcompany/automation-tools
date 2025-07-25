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
    slug: item.slug
  }));

  return params;
}

export default async function NiceApp({ params }) {
	let { company, slug } = await params;

	let data = fetchCompanyAndSlugData();
	let components = data.filter((item) => {
		if (item.company === company && item.slug === slug) {
			return item.component;
		}
	});

	let content;

	if (!slug) {
		content = <p>Loading...</p>;
	} else if (slug !== '' && components.length > 0) {
		content = components[0].component || <p>Component not found</p>;
	}else {
		content = <p>404 - Page Not Found</p>;
	}

  return content;
}

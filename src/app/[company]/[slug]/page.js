'use client'

import Link from "next/link";
import { handleChange, copyToClipboard, handleCheckbox, isDefined } from "@/helpers/functions";
import { useState } from "react";
import Postman from "@/components/postman";
import FindNewTags from "@/components/find-new-tags";
import Dispositions from "@/components/dispositions";
import { usePathname } from "next/navigation";
import HoursOfOperation from "@/components/hours-of-operation";

export default function NiceApp() {
	let slug = usePathname();
	slug = slug ? slug.split('/').filter(Boolean) : [];
	slug = slug.length > 0 ? slug[slug.length - 1] : null;

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

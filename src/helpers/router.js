import Dispositions from "@/components/dispositions";
import FindNewTags from "@/components/find-new-tags";
import HoursOfOperation from "@/components/hours-of-operation";
import Postman from "@/components/postman";
import TextToTags from "@/components/text-to-tags";

export default function fetchCompanyAndSlugData() {
  return [
    { company: 'nice', slug: 'postman', text: "Postman", component: <Postman /> },
    { company: 'nice', slug: 'find-new-tags', text: "Compare New Tags with API Tags", component: <FindNewTags /> },
    { company: 'nice', slug: 'dispositions', text: "Dispositions (To JSON)", component: <Dispositions /> },
    { company: 'nice', slug: 'hours-of-operation', text: "Hours of Operation (To JSON)", component: <HoursOfOperation /> },
    { company: 'nice', slug: 'text-to-tags', text: "Text to Tags (To JSON)", component: <TextToTags /> },
  ];
}
import Dispositions from "@/components/dispositions";
import FindNewTags from "@/components/find-new-tags";
import HoursOfOperation from "@/components/hours-of-operation";
import Postman from "@/components/postman";
import SkillsDispositionUpdate from "@/components/skills-disposition-update";
import SkillsDispositionUpdateV32 from "@/components/skills-disposition-update-v32";
import TextToTags from "@/components/text-to-tags";

export default function fetchCompanyAndSlugData() {
  return [
    { company: 'nice', slug: 'postman', text: "Postman", component: <Postman /> },
    { company: 'nice', slug: 'find-new-tags', text: "Compare New Tags with API Tags", component: <FindNewTags /> },
    { company: 'nice', slug: 'dispositions', text: "Dispositions (To JSON)", component: <Dispositions /> },
    { company: 'nice', slug: 'hours-of-operation', text: "Hours of Operation (To JSON)", component: <HoursOfOperation /> },
    { company: 'nice', slug: 'text-to-tags', text: "Text to Tags (To JSON)", component: <TextToTags /> },
    { company: 'nice', slug: 'skills-disposition-update-v28', text: "Skills Disposition Update By Skill ID (v28)", component: <SkillsDispositionUpdate /> },
    { company: 'nice', slug: 'skills-disposition-update-v32', text: "Skills Disposition Update By Skill ID (v32)", component: <SkillsDispositionUpdateV32 /> },
  ];
}
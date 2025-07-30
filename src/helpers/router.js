import Dispositions from "@/components/dispositions";
import FindNewTags from "@/components/find-new-tags";
import HoursOfOperation from "@/components/hours-of-operation";
import Postman from "@/components/postman";
import GenesysResponseContract from "@/components/response-contract";
import SkillsDispositionUpdate from "@/components/skills-disposition-update";
import SkillsDispositionUpdateV32 from "@/components/skills-disposition-update-v32";
import TextToTags from "@/components/text-to-tags";

export default function fetchCompanyAndSlugData() {
  return [
    { company: 'custom', slug: 'postman', text: "Postman", component: <Postman /> },
    { company: '', slug: 'flow', text: "Visualize Flow" },
    { company: 'nice', slug: 'find-new-tags', text: "Compare New Tags with API Tags", component: <FindNewTags />, label: "NICE CXone" },
    { company: 'nice', slug: 'dispositions', text: "Dispositions (To JSON)", component: <Dispositions />, label: "NICE CXone" },
    { company: 'nice', slug: 'hours-of-operation', text: "Hours of Operation (To JSON)", component: <HoursOfOperation />, label: "NICE CXone" },
    { company: 'nice', slug: 'text-to-tags', text: "Text to Tags (To JSON)", component: <TextToTags />, label: "NICE CXone" },
    { company: 'nice', slug: 'skills-disposition-update-v28', text: "Skills Disposition Update By Skill ID (v28)", component: <SkillsDispositionUpdate />, label: "NICE CXone" },
    { company: 'nice', slug: 'skills-disposition-update-v32', text: "Skills Disposition Update By Skill ID (v32)", component: <SkillsDispositionUpdateV32 />, label: "NICE CXone" },
    { company: 'genesys', slug: 'genesys-contracts', text: "Genesys Response Contracts - Custom Actions", component: <GenesysResponseContract />, label: "Genesys Cloud" },
  ];
}
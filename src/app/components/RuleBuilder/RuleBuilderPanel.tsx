import RuleInputForm from "@/components/RuleBuilder/RuleInputForm";
import RuleList from "@/components/RuleBuilder/RuleList";

export default function RuleBuilderPanel() {
  return (
    <>
      <h2>📜 Rule Builder</h2>
      <RuleInputForm />
      <RuleList />
    </>
  );
}

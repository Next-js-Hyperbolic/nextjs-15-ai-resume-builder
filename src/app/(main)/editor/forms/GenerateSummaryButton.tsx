import LoadingButton from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { ResumeTypes } from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import { useState } from "react";
import { generateSummary } from "./actions";

interface GenerateSummaryButtonProps {
  resumeData: ResumeTypes;
  onSummaryGenerated: (summary: string) => void;
}

export default function GenerateSummaryButton({
  resumeData,
  onSummaryGenerated,
}: GenerateSummaryButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    // TODO: Block for non-premium users
    try {
      setLoading(true);
      const aiResponse = await generateSummary(resumeData);
      onSummaryGenerated(aiResponse);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoadingButton
      loading={loading}
      onClick={handleClick}
      variant="outline"
      type="button"
      onClickCapture={handleClick}
    >
      <WandSparklesIcon className="size-4" />
      Generate (AI)
    </LoadingButton>
  );
}

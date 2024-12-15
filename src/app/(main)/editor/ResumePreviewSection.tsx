import ResumePreview from "@/components/ResumePreview";
import { EditorFormProps } from "@/lib/types";
import { ResumeTypes } from "@/lib/validation";

interface ResumePreviewSectionProps {
  resumeData: ResumeTypes;
  setResumeData: (data: ResumeTypes) => void;
}

export default function ResumePreviewSection({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  return (
    <div className="hidden w-1/2 md:flex">
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <ResumePreview
          resumeData={resumeData}
          className="max-w-2xl shadow-md"
        />
      </div>
    </div>
  );
}

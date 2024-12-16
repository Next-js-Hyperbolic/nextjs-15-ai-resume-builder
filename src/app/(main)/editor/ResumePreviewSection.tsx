import ResumePreview from "@/components/ResumePreview";
import { EditorFormProps } from "@/lib/types";
import { ResumeTypes } from "@/lib/validation";
import ColorPicker from "./ColorPicker";

interface ResumePreviewSectionProps {
  resumeData: ResumeTypes;
  setResumeData: (data: ResumeTypes) => void;
}

export default function ResumePreviewSection({
  resumeData,
  setResumeData,
}: EditorFormProps) {
  return (
    <div className="relative hidden w-1/2 md:flex">
      <div className="absolute left-1 top-1 flex flex-none flex-col gap-3 lg:left-3 lg:top-3">
        <ColorPicker
          color={resumeData.colorHex}
          onChange={(color) =>
            setResumeData({ ...resumeData, colorHex: color.hex })
          }
        />
      </div>
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <ResumePreview
          resumeData={resumeData}
          className="max-w-2xl shadow-md"
        />
      </div>
    </div>
  );
}

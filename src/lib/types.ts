import { ResumeTypes } from "./validation";

export interface EditorFormProps {
    resumeData: ResumeTypes
    setResumeData: (data: ResumeTypes) => void
}
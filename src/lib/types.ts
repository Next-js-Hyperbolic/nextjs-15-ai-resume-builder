import { Prisma } from "@prisma/client";
import { ResumeTypes } from "./validation";

export interface EditorFormProps {
    resumeData: ResumeTypes
    setResumeData: (data: ResumeTypes) => void
}

export const resumeDataInclude = {
    workExperiences: true,
    educations: true,
  } satisfies Prisma.ResumeInclude;
  
  export type ResumeServerData = Prisma.ResumeGetPayload<{
    include: typeof resumeDataInclude;
  }>;
// Form schemas
import { z } from 'zod'

export const optionalString = z.string().trim().optional().or(z.literal(''))

export const generalInfoSchema = z.object({
    title: optionalString,
    description: optionalString,
})

export type GeneralInfoTypes = z.infer<typeof generalInfoSchema>

export const personalInfoSchema = z.object({
    photo: z.custom<File | undefined>(
        ).refine(
            file => !file || (file instanceof File && file.type.startsWith('image/')), "Must be an image file."
        ).refine(
         file => !file || file.size <= 1024 * 1024 * 4, "File size must be less than 4MB."   
        ),
    firstName: optionalString,
    lastName: optionalString,
    jobTitle: optionalString,
    city: optionalString,
    state: optionalString,
    country: optionalString,
    phone: optionalString,
    email: optionalString,
})

export type PersonalInfoTypes = z.infer<typeof personalInfoSchema>

export const workExperienceSchema = z.object({
    workExperiences: z.array(z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
    })).optional(),
})

export type WorkExperienceTypes = z.infer<typeof workExperienceSchema>

export type WorkExperience = NonNullable<z.infer<typeof workExperienceSchema>['workExperiences']>[number]

export const educationSchema = z.object({
    educations: z.array(z.object({
        degree: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
    })).optional(),
})

export type EducationTypes = z.infer<typeof educationSchema>

export const skillsSchema = z.object({
    skills: z.array(z.string().trim()).optional(),
})

export type SKillsTypes = z.infer<typeof skillsSchema>


export const summarySchema = z.object({
    summary: optionalString,
})

export type SummaryTypes = z.infer<typeof summarySchema>

export const resumeSchema = z.object({
    ...generalInfoSchema.shape,
    ...personalInfoSchema.shape,
    ...workExperienceSchema.shape,
    ...educationSchema.shape,
    ...skillsSchema.shape,
    ...summarySchema.shape,
    colorHex: optionalString,
    borderStyle: optionalString,
})

export type ResumeTypes = Omit<z.infer<typeof resumeSchema>, "photo"> & {
    id?: string
    photo?: File | string | null
}


// OPEN AI
export const generateWorkExperienceSchema = z.object({
    description: z.string().trim().min(1, "Description required.").min(20, "Must be at least 20 characters long."),
})

export type GenerateWorkExperienceTypes = z.infer<typeof generateWorkExperienceSchema>

export const generateSummarySchema = z.object({
    jobTitle: optionalString,
    ...workExperienceSchema.shape,
    ...educationSchema.shape,
    ...skillsSchema.shape,
})

export type GenerateSummaryTypes = z.infer<typeof generateSummarySchema>
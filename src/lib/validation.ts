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

export const resumeSchema = z.object({
    ...generalInfoSchema.shape,
    ...personalInfoSchema.shape,
    ...workExperienceSchema.shape,
})

export type ResumeTypes = Omit<z.infer<typeof resumeSchema>, "photo"> & {
    id?: string
    photo?: File | string | null
}
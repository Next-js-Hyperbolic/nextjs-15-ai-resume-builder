"use server"

import { canCreateResume, canUseCustomizations } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeSchema, ResumeTypes } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import {del, put} from "@vercel/blob"
import exp from "constants";
import path from "path";

export async function saveResume(values: ResumeTypes) {
    const {id} = values

    console.log("recevied values:", values);

    const { 
        photo, workExperiences, educations, ...resumeValues
     } = resumeSchema.parse(values);

     const { userId } = await auth();

     if (!userId) {
         throw new Error("Unauthorized");
     }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);

    if (!id) {
        const resumeCount = await prisma.resume.count({where: {userId}})

        if (!canCreateResume(subscriptionLevel, resumeCount)) {
            throw new Error("You have reached the maximum number of resumes allowed for your subscription level.")
        }
    }

    const existingResume = id ? await prisma.resume.findUnique({where: {id, userId}}) : null;

    if (id && !existingResume) {
        throw new Error("Resume not found");
    }

    const hasCustomizations = (resumeValues.borderStyle && resumeValues.borderStyle !== existingResume?.borderStyle) || (resumeValues.colorHex && resumeValues.colorHex !== existingResume?.colorHex);

    if (hasCustomizations && !canUseCustomizations(subscriptionLevel)) {
        throw new Error("You do not have permission to use customizations. Please upgrade your subscription.")
    }

    let newPhotoUrl: string | undefined | null = undefined;

    if (photo instanceof File) {
        // Delete existing image if one exists.
        if (existingResume?.photoUrl) {
            await del(existingResume.photoUrl);
        }

        const blob = await put(`resume_photo/${path.extname(photo.name)}`, photo, {
            access: "public"
        })

        newPhotoUrl = blob.url;
    } else if (photo === null) {
        if (existingResume?.photoUrl) {
            await del(existingResume.photoUrl);
        }
        newPhotoUrl = null;
    }

    if (id) {
        return prisma.resume.update({
            where: {id},
            data: {
                ...resumeValues,
                photoUrl: newPhotoUrl,
                workExperiences: {
                    deleteMany: {},
                    create: workExperiences?.map((exp) => ({
                        ...exp,
                        startDate: exp.startDate ? new Date(exp.startDate) : undefined,
                        endDate: exp.endDate ? new Date(exp.endDate) : undefined,
                    }))
                },
                educations: {
                    deleteMany: {},
                    create: educations?.map((edu) => ({
                        ...edu,
                        startDate: edu.startDate ? new Date(edu.startDate) : undefined,
                        endDate: edu.endDate ? new Date(edu.endDate) : undefined,
                    }))
                },
                updatedAt: new Date()
            }
        })
    } else {
        return prisma.resume.create({
            data: {
                ...resumeValues,
                userId,
                photoUrl: newPhotoUrl,
                workExperiences: {
                    create: workExperiences?.map((exp) => ({
                        ...exp,
                        startDate: exp.startDate ? new Date(exp.startDate) : undefined,
                        endDate: exp.endDate ? new Date(exp.endDate) : undefined,
                    }))
                },
                educations: {
                    create: educations?.map((edu) => ({
                        ...edu,
                        startDate: edu.startDate ? new Date(edu.startDate) : undefined,
                        endDate: edu.endDate ? new Date(edu.endDate) : undefined,
                    }))
                },
            }
        })
    }

}
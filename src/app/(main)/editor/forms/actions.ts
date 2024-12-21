"use server"

import openai from "@/lib/openai";
import { generateSummarySchema, GenerateSummaryTypes, generateWorkExperienceSchema, GenerateWorkExperienceTypes, WorkExperienceTypes, WorkExperience } from "@/lib/validation";

/**
 * Generates a professional resume summary from OpenAI API based on the provided input.
 * 
 * @param {GenerateSummaryTypes} input - The input data for generating the summary, including job title, work experiences, educations, and skills.
 * @returns {Promise<void>} A promise that resolves when the summary generation is complete.
 */
export async function generateSummary(input: GenerateSummaryTypes) {
    // TODO: Block for non-premium users

    const {jobTitle, workExperiences, educations, skills} = generateSummarySchema.parse(input);

    const systemMessage = `
        You are a job resume generator. You have been given the task of generating a summary for a job applicant. Only return the summary and do not include any other information in the response. Keep it concise and professional.
    `

    const userMessage = `
        Please generate a professional resume summary from the following data:

        Job Title: ${jobTitle || "N/A"}
        Work Experiences: ${workExperiences?.map((exp) => `
            Position: ${exp.position || "N/A"}
            Description: ${exp.description || "N/A"}
            Company: ${exp.company || "N/A"}
            Start Date: ${exp.startDate || "N/A"}
            End Date: ${exp.endDate || "Present"}
        `).join("\n") || "N/A"}

        Education: ${educations?.map((edu) => `
            Degree: ${edu.degree || "N/A"}
            School: ${edu.school || "N/A"}
            Start Date: ${edu.startDate || "N/A"}
            End Date: ${edu.endDate || "Present"}
        `).join("\n") || "N/A"}

        Skills: 
            ${skills}
    `

    console.log(`systemMessage`, systemMessage)
    console.log(`userMessage`, userMessage)

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: systemMessage},
            {role: "user", content: userMessage},
        ],
    })

    const aiResponse = completion.choices[0].message.content;

    if (!aiResponse) {
        throw new Error("Failed to generate ai Summary");
    }

    return aiResponse;
}

export async function generateWorkExperience(
    input: GenerateWorkExperienceTypes
) {
    const {description} = generateWorkExperienceSchema.parse(input);

    const systemMessage = `
        You are a job resume generator. Your task is to generate a single work experience entry based on the user input (user message). Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

        Job title: <job title>
        Company: <company name>
        Start date: <format: YYYY-MM-DD (only if provided)>
        End date: <format: YYYY-MM-DD (only if provided)>
        Description: <an optimized description in bullet format, might be inferred from the job title>
    `
    const userMessage = `
        Please generate a work experience entry based on the following description:

        Description: ${description}
    `

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: systemMessage},
            {role: "user", content: userMessage},
        ],
    })

    const aiResponse = completion.choices[0].message.content;

    if (!aiResponse) {
        throw new Error("Failed to generate ai Work Experience");
    }

    console.log(`aiResponse`, aiResponse)

    return {
        position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
        company: aiResponse.match(/Company: (.*)/)?.[1] || "",
        description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
        startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
        endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
      } satisfies WorkExperience;
}
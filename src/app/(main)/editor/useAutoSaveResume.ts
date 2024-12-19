import useDebounce from "@/hooks/useDebounce";
import { ResumeTypes } from "@/lib/validation";
import { useEffect, useState } from "react";

export default function useAutoSaveResume(resumeData: ResumeTypes) {
    const debouncedResumeData = useDebounce(resumeData, 1500);

    const [lastSavedData, setLastSavedData] = useState(structuredClone(resumeData));

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function save() {
            try {
                setIsSaving(true);

                console.log('Saving!')

                // Temporary delay to simulate network latency on typical save request
                await new Promise(resolve => setTimeout(resolve, 1000));

                // await saveResumeData(debouncedResumeData);
                setLastSavedData(structuredClone(debouncedResumeData));
            } catch (e) {
                console.error(e);
            } finally {
                setIsSaving(false);
            }
        }

        const hasUnsavedChanges = JSON.stringify(debouncedResumeData) !== JSON.stringify(lastSavedData);

        if (hasUnsavedChanges && debouncedResumeData && !isSaving) {
            save();
        }
    },[debouncedResumeData, lastSavedData, isSaving]);

    return { 
        isSaving, 
        hasUnsavedChanges: 
            JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
        };
}

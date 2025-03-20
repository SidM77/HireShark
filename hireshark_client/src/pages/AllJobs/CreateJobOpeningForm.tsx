"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
    jobTitle: z.string().min(3, {
        message: "Job Title must be at least 3 characters.",
    }),
    jobDescription: z.string().min(3, {
        message: "Job Description must be at least 3 characters.",
    })
})

interface CreateJobOpeningFormProps {
    onSave: (jobTitle: string, jobDescription: string) => void;
}

const CreateJobOpeningForm: React.FC<CreateJobOpeningFormProps> = ({ onSave }) => {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            jobTitle: "",
            jobDescription: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        onSave(values.jobTitle, values.jobDescription);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Specify a Job Title..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Give your Job Title
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Specify a Job Description..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Give a descriptive Job Description...
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Create Job Opening</Button>
            </form>
        </Form>
    )
}

export default CreateJobOpeningForm;
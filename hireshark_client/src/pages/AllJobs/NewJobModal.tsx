import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import CreateJobOpeningForm from './CreateJobOpeningForm';

interface NewJobModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onCreateJob: (jobTitle: string, jobDescription: string) => void;
}

const NewJobModal: React.FC<NewJobModalProps> = ({open, setOpen, onCreateJob}) => {
    
    // const handleCloseDialog = () => {
    //     setOpen(false);
    // }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Job Opening</DialogTitle>
                    <DialogDescription>
                        Create a new job opening by adding a job description and add below resumes to our ranking system.
                    </DialogDescription>
                </DialogHeader>
                <CreateJobOpeningForm onSave={onCreateJob} />
            </DialogContent>
        </Dialog>

    )
}

export default NewJobModal
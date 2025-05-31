import CustomDialog from "@/components/molecules/CustomDialog";
import { Candidate } from "@/services/candidate.service";

interface DialogCandidateProps {
    candidate: Candidate;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const DialogCandidate = ({ candidate, trigger, open, onOpenChange }: DialogCandidateProps) => {
    return (
        <CustomDialog
            dialogTitle={`Candidate: ${candidate.user.name}`}
            trigger={trigger}
            open={open}
            onOpenChange={onOpenChange}
        >
            <div className="space-y-4 p-2">
                <div>
                    <strong>Email:</strong> {candidate.user.email}
                </div>
            </div>
        </CustomDialog>
    );
};

export default DialogCandidate;

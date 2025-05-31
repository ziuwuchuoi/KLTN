import CustomDialog from "@/components/molecules/CustomDialog";
import { Recruiter } from "@/services/recruiter.service";
import { Button } from "@/components/ui/button";

interface DialogRecruiterProps {
    recruiter: Recruiter;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const DialogRecruiter = ({ recruiter, trigger, open, onOpenChange }: DialogRecruiterProps) => {
    return (
        <CustomDialog
            dialogTitle={`Recruiter: ${recruiter.user.name}`}
            trigger={trigger}
            open={open}
            onOpenChange={onOpenChange}
        >
            <div className="space-y-4 p-2">
                <div><strong>Email:</strong> {recruiter.user.email}</div>
                <div><strong>Company:</strong> {recruiter.companyName || "N/A"}</div>
                <div><strong>Position:</strong> {recruiter.position || "N/A"}</div>
                <div><strong>Can Recruit:</strong> {recruiter.user.canBeRecruiter ? "Yes" : "No"}</div>
            </div>
        </CustomDialog>
    );
};

export default DialogRecruiter;

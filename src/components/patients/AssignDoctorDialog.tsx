import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";

import DoctorFilter from "../shared/DoctorFilter";

const AssignDoctorDialog = ({ open, onOpenChange, value, onChange, onSave }: any) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Assign Primary Doctor</DialogTitle>
                </DialogHeader>

                <DoctorFilter value={value} onChange={onChange} />

                <div className="flex justify-end mt-4">
                    <Button onClick={onSave} className="bg-brand-700 text-white">
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssignDoctorDialog;
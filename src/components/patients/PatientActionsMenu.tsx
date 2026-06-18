import {
    Pencil,
    Trash2,
    UserPlus,
    RotateCcw,
    Printer,
    MoreVertical
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";

const PatientActionsMenu = ({ patient }: any) => {
    const { can } = usePermissions();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="rounded-lg">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="rounded-xl w-52">

                {can("patients.update") && (
                    <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Patient
                    </DropdownMenuItem>
                )}

                {can("patients.update") && (
                    <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Doctor
                    </DropdownMenuItem>
                )}

                {/* {can("patients.read") && (
                    <DropdownMenuItem>
                        <Printer className="h-4 w-4 mr-2" />
                        Print Profile
                    </DropdownMenuItem>
                )} */}

                {patient.status === "ARCHIVED" &&
                    can("patients.update") && (
                        <DropdownMenuItem>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restore
                        </DropdownMenuItem>
                    )}

                {can("patients.delete") && (
                    <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PatientActionsMenu;
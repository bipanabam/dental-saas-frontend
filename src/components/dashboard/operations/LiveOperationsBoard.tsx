import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    TableHeader,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

export function LiveOperationsBoard({
    rows,
}: {
    rows: PipelineRow[];
}) {
    return (
        <Table>

            <TableHeader>
                <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>ETA</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>

                {rows.map((row) => (
                    <TableRow key={row.id}>

                        <TableCell>
                            {row.time}
                        </TableCell>

                        <TableCell>
                            {row.patient}
                        </TableCell>

                        <TableCell>
                            {row.doctor}
                        </TableCell>

                        <TableCell>
                            <Badge>
                                {row.stage}
                            </Badge>
                        </TableCell>

                        <TableCell>
                            {row.eta}
                        </TableCell>

                    </TableRow>
                ))}

            </TableBody>

        </Table>
    );
}
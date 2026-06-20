import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const GeneralSettingsPage = () => {
    return (
        <div className="space-y-6">
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle>
                        General Workspace
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    General application settings.
                </CardContent>
            </Card>

            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle>
                        Localization
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    Timezone, date formats and locale.
                </CardContent>
            </Card>
        </div>
    );
}

export default GeneralSettingsPage;
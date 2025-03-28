import { Fragment } from "react";
import { Menu } from "@mantine/core";
import { IconReportAnalytics , IconTrash } from "@tabler/icons-react";
import appStrings from "../../utils/strings";

export default function YourProjectAction({ onAnalysis, onDeleteTap }) {
    return (
        <Fragment>
            <Menu.Item leftSection={<IconReportAnalytics size="1rem"  />} onClick={onAnalysis}>
                {appStrings.language.btn.analysis}
            </Menu.Item>
            <Menu.Item c="red" leftSection={<IconTrash size="1rem"  />} onClick={onDeleteTap}>
                {appStrings.language.btn.delete}
            </Menu.Item>
        </Fragment>
    );
}
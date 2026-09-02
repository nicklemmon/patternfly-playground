import { Panel, PanelMain, PanelMainBody } from '@patternfly/react-core';
import styles from "./node-step.module.css"

export function NodeStep({ children }: { children: React.ReactNode }) {
    return (
        <Panel isGlass variant="raised" className={styles["panel"]} >
            <PanelMain>
                <PanelMainBody className={styles["panel-body"]}>
                    {children}
                </PanelMainBody>
            </PanelMain>
        </Panel>
    )
}
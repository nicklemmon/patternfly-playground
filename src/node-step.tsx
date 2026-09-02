import { Panel, PanelMain, PanelMainBody, Title, Flex, FlexItem } from '@patternfly/react-core';
import { NodeStepLink } from "./node-step-link.tsx";
import styles from "./node-step.module.css"

export function NodeStep({ title, children }: { title: string; childre?: React.ReactNode }) {
    return (
        <Panel isGlass variant="raised" className={styles["panel"]} >
            <PanelMain>
                <PanelMainBody className={styles["panel-body"]}>
                    <Flex direction={{ default: "column" }} gap={{ default: "gapXs" }}>
                        <FlexItem>
                            <Title headingLevel="h3" size="sm">{title}</Title>
                        </FlexItem>

                        {children ? (
                            <FlexItem>
                                {children}
                            </FlexItem>
                        ) : null}

                        <FlexItem align={{ default: 'alignRight' }}>
                            <NodeStepLink to="/hello-world">Hello!</NodeStepLink>
                        </FlexItem>
                    </Flex>
                </PanelMainBody>
            </PanelMain>
        </Panel>
    )
}
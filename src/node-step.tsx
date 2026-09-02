import React, { useState } from 'react';
import {
    Panel,
    PanelMain,
    PanelMainBody,
    Title,
    Flex,
    FlexItem,
    Dropdown,
    DropdownList,
    MenuToggle
} from '@patternfly/react-core';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import { NodeStepLink } from "./node-step-link.tsx";
import styles from "./node-step.module.css";

interface NodeStepProps {
    title: string;
    children?: React.ReactNode;
    actions?: React.ReactNode;
}

export function NodeStep({ title, children, actions }: NodeStepProps) {
    const [isKebabOpen, setIsKebabOpen] = useState(false);

    return (
        <Panel isGlass variant="raised" className={styles["panel"]}>
            <PanelMain>
                <PanelMainBody className={styles["panel-body"]}>
                    <Flex direction={{ default: "column" }} gap={{ default: "gapXs" }}>

                        {/* Header row containing title and optional kebab menu */}
                        <FlexItem>
                            <Flex
                                justifyContent={{ default: 'justifyContentSpaceBetween' }}
                                alignItems={{ default: 'alignItemsCenter' }}
                            >
                                <FlexItem>
                                    <Title headingLevel="h3" size="md">{title}</Title>
                                </FlexItem>

                                {actions && (
                                    <FlexItem>
                                        <Dropdown
                                            isOpen={isKebabOpen}
                                            onSelect={() => setIsKebabOpen(false)}
                                            onOpenChange={(isOpen) => setIsKebabOpen(isOpen)}
                                            toggle={(toggleRef: React.Ref<HTMLButtonElement>) => (
                                                <MenuToggle
                                                    ref={toggleRef}
                                                    aria-label="Node step actions"
                                                    variant="plain"
                                                    onClick={() => setIsKebabOpen(!isKebabOpen)}
                                                    isExpanded={isKebabOpen}
                                                >
                                                    <EllipsisVIcon />
                                                </MenuToggle>
                                            )}
                                        >
                                            <DropdownList>{actions}</DropdownList>
                                        </Dropdown>
                                    </FlexItem>
                                )}
                            </Flex>
                        </FlexItem>

                        {children ? (
                            <FlexItem>
                                {children}
                            </FlexItem>
                        ) : null}

                        <FlexItem>
                            <NodeStepLink to="/hello-world">Edit</NodeStepLink>
                        </FlexItem>
                    </Flex>
                </PanelMainBody>
            </PanelMain>
        </Panel>
    );
}
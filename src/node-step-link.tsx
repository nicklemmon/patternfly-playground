import { Button } from "@patternfly/react-core";
import { ArrowRightIcon } from "@patternfly/react-icons"
import styles from "./node-step-link.module.css"

export function NodeStepLink({ to, children }: { to: string; children: React.ReactNode; }) {
    return <Button variant="link" isInline icon={<ArrowRightIcon />} iconPosition="end" className={styles["link"]}>{children}</Button>
}
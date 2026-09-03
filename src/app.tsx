import { Button, Card, CardBody, CardTitle, Flex, FlexItem, Title, DropdownItem } from "@patternfly/react-core";
import { NodeStep } from "./node-step.tsx"

export default function App() {
  return (
    <Flex
      style={{ padding: "1.5rem" }}
    >
      <NodeStep title="Manual trigger" actions={
        <>
          <DropdownItem key="edit" onClick={() => console.log('Edit clicked')}>
            Edit step
          </DropdownItem>
          <DropdownItem key="delete" onClick={() => console.log('Delete clicked')}>
            Delete step
          </DropdownItem>
        </>
      }></NodeStep>
    </Flex>
  );
}

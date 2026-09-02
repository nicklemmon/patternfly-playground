import { Button, Card, CardBody, CardTitle, Flex, FlexItem, Title } from "@patternfly/react-core";
import { NodeStep } from "./node-step.tsx"

export default function App() {
  return (
    <Flex
      style={{ padding: "1.5rem" }}
    >
      <NodeStep>Hello, world</NodeStep>
    </Flex>
  );
}

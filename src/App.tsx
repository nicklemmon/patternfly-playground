import { Button, Card, CardBody, CardTitle, Flex, FlexItem, Title } from "@patternfly/react-core";

export default function App() {
  return (
    <Flex
      direction={{ default: "column" }}
      gap={{ default: "gapMd" }}
      style={{ padding: "1.5rem", maxWidth: 640 }}
    >
      <FlexItem>
        <Title headingLevel="h1" size="2xl">
          PatternFly playground
        </Title>
      </FlexItem>
      <FlexItem>
        <Card>
          <CardTitle>Throwaway starter</CardTitle>
          <CardBody>
            Edit <code>src/App.tsx</code> and try PatternFly components here.
          </CardBody>
        </Card>
      </FlexItem>
      <FlexItem>
        <Button variant="primary">Primary</Button> <Button variant="secondary">Secondary</Button>{" "}
        <Button variant="link">Link</Button>
      </FlexItem>
    </Flex>
  );
}

// PROTOTYPE: A modal command palette for Syntara's visible navigation destinations.
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Shortcut from "@patternfly/react-component-groups/dist/dynamic/Shortcut";
import {
  Alert,
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  Label,
  Menu,
  MenuContent,
  MenuGroup,
  MenuSearch,
  MenuSearchInput,
  Modal,
  ModalBody,
  ModalHeader,
  SearchInput,
  SimpleList,
  SimpleListItem,
  Title,
} from "@patternfly/react-core";
import {
  RhUiConnectedIcon,
  RhUiKeyIcon,
  RhUiLikeIcon,
  RhUiListIcon,
  RhUiNetworkIcon,
  RhUiPlayCircleIcon,
  RhUiSecuredIcon,
  RhUiSettingsIcon,
  RhUiUsersIcon,
  SearchIcon,
} from "@patternfly/react-icons";

type Category = "Main" | "Configuration" | "System Administration";
type Command = {
  id: string;
  title: string;
  description: string;
  path: string;
  category: Category;
  icon: ReactNode;
};

// Snapshot of visible destinations in syntara/frontend/packages/syntara-ui/src/app/navigationItems.tsx.
// The real app filters some entries by permissions; this isolated prototype shows the full set.
const commands: Command[] = [
  {
    id: "builder",
    title: "Workflow Builder",
    description: "Create a workflow",
    path: "/workflow-builder/new",
    category: "Main",
    icon: <RhUiNetworkIcon style={{ transform: "rotate(270deg)" }} />,
  },
  {
    id: "workflows",
    title: "Workflows",
    description: "Browse and manage workflows",
    path: "/workflows",
    category: "Main",
    icon: <RhUiListIcon />,
  },
  {
    id: "runs",
    title: "Workflow Runs",
    description: "Review workflow executions",
    path: "/executions",
    category: "Main",
    icon: <RhUiPlayCircleIcon />,
  },
  {
    id: "approvals",
    title: "Approvals",
    description: "Review requests awaiting a decision",
    path: "/approvals",
    category: "Main",
    icon: <RhUiLikeIcon />,
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "View connected services",
    path: "/configuration/integrations",
    category: "Configuration",
    icon: <RhUiConnectedIcon />,
  },
  {
    id: "credentials",
    title: "Credentials",
    description: "Manage saved credentials",
    path: "/configuration/credentials",
    category: "Configuration",
    icon: <RhUiKeyIcon />,
  },
  {
    id: "access",
    title: "Access Management",
    description: "Manage users, groups, and roles",
    path: "/system-administration/access-management",
    category: "System Administration",
    icon: <RhUiUsersIcon />,
  },
  {
    id: "identity",
    title: "Identity Providers",
    description: "Configure sign-in providers",
    path: "/system-administration/authentication",
    category: "System Administration",
    icon: <RhUiSecuredIcon />,
  },
  {
    id: "settings",
    title: "Settings",
    description: "Open system settings",
    path: "/system-administration/settings",
    category: "System Administration",
    icon: <RhUiSettingsIcon />,
  },
];
const categories: Category[] = ["Main", "Configuration", "System Administration"];

function matchingCommands(query: string) {
  const term = query.trim().toLowerCase();
  return commands.filter(
    (command) =>
      !term ||
      `${command.title} ${command.description} ${command.category} ${command.path}`
        .toLowerCase()
        .includes(term),
  );
}

function SpotlightContents({
  query,
  setQuery,
  choose,
}: {
  query: string;
  setQuery: (query: string) => void;
  choose: (command: Command) => void;
}) {
  const results = useMemo(() => matchingCommands(query), [query]);
  const resultStatus =
    results.length === 0
      ? "No navigation results available."
      : `${results.length} navigation ${results.length === 1 ? "result" : "results"} available.`;

  return (
    <Menu className="spotlight-palette" isPlain isScrollable isRootMenu={false}>
      <MenuSearch role="search" aria-label="Syntara navigation search">
        <MenuSearchInput>
          <SearchInput
            aria-label="Search Syntara navigation"
            searchInputId="spotlight-modal-search"
            value={query}
            placeholder="Search Syntara pages"
            onChange={(_, next) => setQuery(next)}
            onClear={() => setQuery("")}
          />
        </MenuSearchInput>
      </MenuSearch>
      <MenuContent className="spotlight-results">
        <span className="pf-v6-screen-reader" role="status" aria-live="polite" aria-atomic="true">
          {resultStatus}
        </span>
        {results.length === 0 && (
          <EmptyState variant="sm" icon={SearchIcon} titleText="No matches" headingLevel="h3">
            <EmptyStateBody>
              No results found for <strong>{query.trim()}</strong>.
            </EmptyStateBody>
          </EmptyState>
        )}
        {categories.map((category) => {
          const group = results.filter((command) => command.category === category);
          return (
            group.length > 0 && (
              <MenuGroup label={category} labelHeadingLevel="h3" key={category}>
                <SimpleList isControlled={false} aria-label={`${category} destinations`}>
                  {group.map((command) => (
                    <SimpleListItem
                      key={command.id}
                      itemId={command.id}
                      component="a"
                      href={command.path}
                      onClick={(event) => {
                        event.preventDefault();
                        choose(command);
                      }}
                    >
                      <span className="spotlight-result">
                        <span className="spotlight-result-icon" aria-hidden="true">
                          {command.icon}
                        </span>
                        <span className="spotlight-result-copy">
                          <span>{command.title}</span>
                          <span className="spotlight-result-description">
                            {command.description}
                          </span>
                        </span>
                      </span>
                    </SimpleListItem>
                  ))}
                </SimpleList>
              </MenuGroup>
            )
          );
        })}
      </MenuContent>
    </Menu>
  );
}

export function CommandPalettePrototype() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Command | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function choose(command: Command) {
    setSelected(command);
    setOpen(false);
    setQuery("");
  }

  return (
    <section className="proposal">
      <div className="proposal-intro">
        <div>
          <Label color="purple" isCompact>
            Fast access
          </Label>
          <Title headingLevel="h2" size="xl">
            Spotlight
          </Title>
          <p>Jump to a Syntara destination from wherever you are.</p>
        </div>
        <span className="proposal-aside">Designed for frequent tasks</span>
      </div>
      <div className="spotlight-stage">
        <div className="stage-app" aria-hidden="true">
          <div className="stage-app-top">
            <span className="stage-app-logo">S</span>
            <span>Syntara</span>
            <span className="stage-app-top-right">
              Workflows &nbsp; Workflow Runs &nbsp; Approvals
            </span>
          </div>
          <div className="stage-app-body">
            <span>Workflows</span>
            <div className="stage-app-lines">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
        <Bullseye className="spotlight-launcher">
          <Flex alignItems={{ default: "alignItemsCenter" }}>
            <FlexItem>
              <Button variant="primary" size="lg" onClick={() => setOpen(true)}>
                Open command palette
              </Button>
            </FlexItem>
            <FlexItem>
              <Shortcut keys={["cmd", "k"]} />
            </FlexItem>
          </Flex>
        </Bullseye>
      </div>
      {selected && (
        <Alert variant="success" isInline title={`${selected.title} selected`} isLiveRegion>
          Prototype only — would open <code>{selected.path}</code>.
        </Alert>
      )}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        variant="medium"
        position="top"
        positionOffset="10vh"
        aria-label="Command palette"
        elementToFocus="#spotlight-modal-search"
        className="spotlight-modal"
      >
        <ModalHeader title="Command palette" />
        <ModalBody>
          <SpotlightContents query={query} setQuery={setQuery} choose={choose} />
        </ModalBody>
      </Modal>
    </section>
  );
}

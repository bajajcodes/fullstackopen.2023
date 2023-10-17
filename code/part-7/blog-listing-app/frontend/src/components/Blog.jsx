import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Text,
  Link,
  CardFooter,
  Button,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useState } from "react";
import helpers from "../utils/helpers";

export default function Blog(props) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const { title, author, url, likes, onIncreaseLikes, onRemoveBlog } = props;
  const loggedInUsername = helpers.getLoggedInUserName();
  const blogUsername = props.user?.username || null;

  return (
    <Card data-test-blog>
      <CardHeader data-test-blog-header>
        <Heading size="md">
          <Link href={url} isExternal>
            {title} <ExternalLinkIcon mx="2px" />
          </Link>
        </Heading>
      </CardHeader>
      {visible && (
        <CardBody data-test-blog-body>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Author
              </Heading>
              <Text pt="2" fontSize="sm">
                {author}
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Likes
              </Heading>
              <Box>
                <Text
                  pt="2"
                  fontSize="sm"
                  aria-label="blog-likes"
                  data-test-blog-likes
                >
                  {likes}
                </Text>
                <Button
                  variant="solid"
                  aria-label="like-blog"
                  onClick={() =>
                    onIncreaseLikes(props.id, { likes: likes + 1 })
                  }
                >
                  Like
                </Button>
              </Box>
            </Box>{" "}
          </Stack>
        </CardBody>
      )}
      <CardFooter
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
        gap={2}
        data-test-blog-footer
      >
        <Button onClick={toggleVisibility} className="toggleVisibility">
          {visible ? "Hide" : "Show"}
        </Button>
        {blogUsername === loggedInUsername && (
          <Button onClick={() => onRemoveBlog(props.id, props)}>Remove</Button>
        )}
      </CardFooter>
    </Card>
  );
}

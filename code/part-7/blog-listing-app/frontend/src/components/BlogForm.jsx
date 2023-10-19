import {
  Heading,
  InputGroup,
  Text,
  Button,
  Grid,
  Container,
  Input,
} from "@chakra-ui/react";
const PLACEHOLDER_BLOG = "Add New";

export default function BlogForm({ addBlog }) {
  function handleAddItem(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = {};
    for (const [key, value] of formData) {
      if (!value) throw Error(`${key} value: ${value} is invalid`);
      payload[key] = value;
    }
    addBlog(payload);
    event.target.reset();
  }
  return (
    <Container maxW="container.sm" data-test-blog-form>
      <Heading as="h3" noOfLines={2}>
        {PLACEHOLDER_BLOG}
      </Heading>
      <form onSubmit={handleAddItem}>
        <Grid gap={2}>
          <InputGroup>
            <Text mb="8px">author: </Text>
            <Input size="sm" required name="author" aria-label="author" />
          </InputGroup>
          <InputGroup>
            <Text mb="8px">title: </Text>
            <Input size="sm" required name="title" aria-label="title" />
          </InputGroup>
          <InputGroup>
            <Text mb="8px">url: </Text>
            <Input size="sm" required name="url" type="url" aria-label="url" />
          </InputGroup>
          <Button variant="solid" type="submit">
            Add
          </Button>
        </Grid>
      </form>
    </Container>
  );
}

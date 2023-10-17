import {
  Heading,
  InputGroup,
  Text,
  Button,
  Grid,
  Container,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";

const PLACEHOLDER_LOGIN = "Login";

export default function LoginForm({ loginUser }) {
  async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = {};
    for (const [key, value] of formData) {
      if (!value) throw Error(`${key} value: ${value} is invalid`);
      payload[key] = value;
    }
    loginUser(payload);
    event.target.reset();
  }
  return (
    <Container>
      <Heading as="h3" noOfLines={2}>
        {PLACEHOLDER_LOGIN}
      </Heading>
      <form onSubmit={handleLogin}>
        <Grid gap={2}>
          <InputGroup>
            <Text mb="8px">username: </Text>
            <Input size="sm" required name="username" autoComplete="username" />
          </InputGroup>
          <InputGroup>
            <Text mb="8px">password: </Text>
            <Input
              size="sm"
              required
              name="password"
              type="password"
              autoComplete="current-password"
            />
          </InputGroup>
          <Button variant="solid" type="submit">
            Login
          </Button>
        </Grid>
      </form>
    </Container>
  );
}

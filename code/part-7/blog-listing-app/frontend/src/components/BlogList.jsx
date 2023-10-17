import {
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Skeleton,
} from "@chakra-ui/react";
import Blog from "./Blog";

function BlogList({
  onIncreaseLikes,
  blogs,
  isLoading,
  onRefresh,
  onRemoveBlog,
}) {
  return (
    <Container>
      <Skeleton isLoaded={!isLoading || blogs.length > 1}>
        <Heading as="h5">Blogs</Heading>
        <Grid gap={4} templateAreas={`"spacer refresh" "list list"`}>
          <GridItem area="spacer"></GridItem>
          <GridItem area="refresh" justifySelf="end">
            <Button variant="solid" onClick={onRefresh}>
              Refresh
            </Button>
          </GridItem>
          <GridItem area="list">
            <Grid gap={4}>
              {blogs.map((b) => (
                <Blog
                  key={b.id}
                  {...b}
                  onIncreaseLikes={onIncreaseLikes}
                  onRemoveBlog={onRemoveBlog}
                />
              ))}
            </Grid>
          </GridItem>
        </Grid>
      </Skeleton>
    </Container>
  );
}

export default BlogList;

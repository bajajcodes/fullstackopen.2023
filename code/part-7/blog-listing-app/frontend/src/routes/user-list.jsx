import { Heading } from "@chakra-ui/react";
import { Link, useLoaderData } from "react-router-dom";

export default function UserList() {
  const users = useLoaderData();
  return (
    <>
      <Heading as="h2"></Heading>
      <table>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </table>
    </>
  );
}

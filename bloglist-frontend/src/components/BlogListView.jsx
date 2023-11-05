import { useQuery } from "@tanstack/react-query";
import { Collapse, Group, Loader, Button, Paper, Space } from "@mantine/core";
import CreateBlogForm from "../components/CreateBlogForm";
import { useDisclosure } from "@mantine/hooks";
import blogService from "../services/blogs";
import { Link } from "react-router-dom";
import classes from "./BlogListView.module.css";

const BlogListView = () => {
  const blogResult = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });
  const blogs = blogResult.data;

  const [createBlogOpened, { toggle }] = useDisclosure(false);
  return (
    <>
      <h2>blogs</h2>
      <Button onClick={toggle}>{createBlogOpened ? "hide" : "create"}</Button>
      <Collapse in={createBlogOpened}>
        <CreateBlogForm />
      </Collapse>
      {blogResult.isLoading ? (
        <Loader color="blue" />
      ) : (
        <div className={classes.blogContainer}>
          {blogs
            .toSorted((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Paper className={classes.blog} withBorder key={blog.id}>
                <Link to={`/blogs/${blog.id}`} state={{ blog }}>
                  {blog.title} {blog.author}
                </Link>
              </Paper>
            ))}
        </div>
      )}
    </>
  );
};

export default BlogListView;

import { useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import blogService from "../services/blogs";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useLoggedInUser } from "../hooks";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Loader,
  Pill,
  Button,
  Group,
  Text,
  Title,
  Box,
  Divider,
  Textarea,
  List,
  Paper,
} from "@mantine/core";
import { IconHeartFilled } from "@tabler/icons-react";
import classes from "./Blog.module.css";

const Blog = () => {
  const [comment, setComment] = useState("");
  const user = useLoggedInUser();
  const { blogId } = useParams();
  const historyState = useLocation().state;
  const blogResult = useQuery({
    queryKey: ["blogs", blogId],
    queryFn: () => blogService.get(blogId),
    refetchOnWindowFocus: false,
    placeholderData: historyState ? historyState.blog : null,
  });
  const blog = blogResult.data;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateBlogDataCache = (data) => {
    //update queries with this specific id
    queryClient.setQueryData(["blogs", data.id], data);

    //update list cache
    queryClient.setQueryData(["blogs"], (old) =>
      old.map((b) => (b.id === blog.id ? data : b)),
    );
  };
  const updateMutation = useMutation({
    mutationFn: (updatedBlog) => {
      return blogService.update(updatedBlog, user);
    },
    onSuccess: updateBlogDataCache,
  });
  const postCommentMutation = useMutation({
    mutationFn: (comment) => {
      return blogService.postComment(blog.id, comment);
    },
    onSuccess: updateBlogDataCache,
  });
  const removeMutation = useMutation({
    mutationFn: (blogToDelete) => {
      return blogService.remove(blogToDelete, user);
    },
    onSuccess: () => {
      queryClient.setQueryData(["blogs"], (old) =>
        old.filter((b) => b.id !== blog.id),
      );
      navigate("/");
    },
  });

  const handleLike = (e) => {
    console.log("like button pressed for blog", blog);
    const updated = { ...blog, likes: blog.likes + 1 };
    updateMutation.mutate(updated);
  };

  const handleRemove = (e) => {
    console.log("Remove button pressed for blog", blog);
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeMutation.mutate(blog);
    }
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (comment) {
      console.log("Post comment", comment);
      postCommentMutation.mutate(comment);
      setComment("");
    }
  };

  if (blogResult.isLoading || (!blog && !historyState)) {
    return (
      <div>
        <h2>Loading blog data...</h2>
        <Loader color="blue" />
      </div>
    );
  }

  const showDelete = user && blog.user.username === user.username;

  return (
    <Box>
      <Box className={classes.blog}>
        <Title order={3}>
          {blog.title} - {blog.author}{" "}
        </Title>
        <Group justify="space-between">
          <Text>
            added by{" "}
            <Text span fs="italic">
              {blog.user.name}
            </Text>
          </Text>
          <Group>
            {user && (
              <Button
                onClick={handleLike}
                color="red"
                size="compact-sm"
                variant="default"
                leftSection={<IconHeartFilled className={classes.heartIcon} />}
                rightSection={<Pill>{blog.likes}</Pill>}
              >
                Like
              </Button>
            )}
            {showDelete && (
              <Button
                variant="filled"
                color="red"
                size="compact-sm"
                onClick={handleRemove}
              >
                Remove
              </Button>
            )}
          </Group>
        </Group>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>{" "}
      </Box>
      <br />
      <Divider my="lg" />
      <Title order={4}>comments</Title>
      <Box maw="24rem">
        <form onSubmit={handlePostComment}>
          <Textarea
            type="text"
            value={comment}
            name="comment"
            onChange={({ target }) => setComment(target.value)}
            my="xs"
          />
          <Button type="submit">add comment</Button>
        </form>
      </Box>
      <List spacing="xs" mt="xs" icon={<></>}>
        {blog.comments.map((comment) => (
          <List.Item key={comment.comment}>
            <Paper p="xs" shadow="xs" withBorder>
              {comment.comment}
            </Paper>
          </List.Item>
        ))}
      </List>
    </Box>
  );
};

export default Blog;

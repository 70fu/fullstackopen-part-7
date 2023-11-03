import { useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import blogService from "../services/blogs";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useLoggedInUser } from "../hooks";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Blog = () => {
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
  const updateMutation = useMutation({
    mutationFn: (updatedBlog) => {
      return blogService.update(updatedBlog, user);
    },
    onSuccess: (data) => {
      //update queries with this specific id
      queryClient.setQueryData(["blogs", data.id], data);

      //update list cache
      queryClient.setQueryData(["blogs"], (old) =>
        old.map((b) => (b.id === blog.id ? data : b)),
      );
    },
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

  if (blogResult.isLoading || (!blog && !historyState)) {
    return <h2>Loading blog data...</h2>;
  }

  const showDelete = user && blog.user.username === user.username;

  return (
    <div>
      <h2>
        {blog.title} - {blog.author}{" "}
      </h2>
      <a href={blog.url} target="_blank" rel="noreferrer">
        {blog.url}
      </a>{" "}
      <br />
      likes {blog.likes} {user && <button onClick={handleLike}>like</button>}{" "}
      <br />
      added by {blog.user.name}
      {showDelete && (
        <>
          <br />
          <button onClick={handleRemove}>remove</button>
        </>
      )}
      <h3>comments</h3>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment.comment}>{comment.comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;

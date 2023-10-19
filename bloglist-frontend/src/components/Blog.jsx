import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import blogService from "../services/blogs";
import PropTypes from "prop-types";

const Blog = ({ blog, showDelete }) => {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (data) => {
      console.log(data);
      console.log(blog);
      queryClient.setQueryData(["blogs"], (old) =>
        old.map((b) => (b.id === blog.id ? data : b)),
      );
    },
  });
  const removeMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.setQueryData(["blogs"], (old) =>
        old.filter((b) => b.id !== blog.id),
      );
    },
  });
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);
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

  if (showDetails) {
    return (
      <div className="blog">
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>hide</button> <br />
        {blog.url} <br />
        likes {blog.likes} <button onClick={handleLike}>like</button> <br />
        {blog.user.name}
        {showDelete && (
          <>
            <br />
            <button onClick={handleRemove}>remove</button>
          </>
        )}
      </div>
    );
  } else {
    return (
      <div className="blog">
        {blog.title} {blog.author} <button onClick={toggleDetails}>view</button>
      </div>
    );
  }
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  showDelete: PropTypes.bool.isRequired,
};

export default Blog;

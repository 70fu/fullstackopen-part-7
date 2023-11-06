import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import blogService from "../services/blogs";
import { notifications } from "@mantine/notifications";
import { useLoggedInUser } from "../hooks";
import { Button, Fieldset, TextInput, Container, Box } from "@mantine/core";

const FormText = ({ name, value, setValue }) => {
  return (
    <div>
      <label>
        {name}
        <input
          type="text"
          value={value}
          name={name}
          onChange={({ target }) => setValue(target.value)}
        />
      </label>
    </div>
  );
};

FormText.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};

const CreateBlogForm = () => {
  const user = useLoggedInUser();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const createBlogMutation = useMutation({
    mutationFn: (newBlog) => {
      return blogService.create(newBlog, user);
    },
    onSuccess: (newBlog) => {
      queryClient.setQueryData(["blogs"], (old) => [...old, newBlog]);
    },
  });
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleBlogCreate = async (target) => {
    target.preventDefault();

    //don't even try sending a post request, if one of the fields is empty and inform the user
    if (!title || !author || !url) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "please input title, author and url",
      });
      return;
    }

    const blog = {
      title: title,
      author: author,
      url: url,
    };

    createBlogMutation.mutate(blog);

    notifications.show({
      title: "Blog added",
      message: `added a new blog "${title}" by "${author}"`,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <Box maw="32rem">
      <Fieldset legend="New Blog">
        <form onSubmit={handleBlogCreate}>
          <TextInput
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <TextInput
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.currentTarget.value)}
          />
          <TextInput
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.currentTarget.value)}
          />
          <Button type="submit">create</Button>
        </form>
      </Fieldset>
    </Box>
  );
};

export default CreateBlogForm;

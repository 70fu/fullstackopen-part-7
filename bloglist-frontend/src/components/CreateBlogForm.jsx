import { useState } from 'react';
import PropTypes from 'prop-types';

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
  )
}

FormText.propTypes ={
  name:PropTypes.string.isRequired,
  value:PropTypes.string.isRequired,
  setValue:PropTypes.func.isRequired
}

const CreateBlogForm = ({ addBlog, pushSuccess, pushError }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleBlogCreate = async (target) => {
    target.preventDefault();

    //don't even try sending a post request, if one of the fields is empty and inform the user
    if(!title || !author || !url){
      pushError('please input title, author and url');
      return;
    }

    const blog = {
      title: title,
      author: author,
      url: url
    }

    addBlog(blog);

    pushSuccess(`added a new blog "${title}" by "${author}"`)

    setTitle('');
    setAuthor('');
    setUrl('');
  }

  return (
    <form onSubmit={handleBlogCreate}>
      <FormText name="title:" value={title} setValue={setTitle} />
      <FormText name="author:" value={author} setValue={setAuthor} />
      <FormText name="url:" value={url} setValue={setUrl} />
      <button id="create-blog-button" type="submit">create</button>
    </form>
  )
}

CreateBlogForm.propTypes = {
  addBlog:PropTypes.func.isRequired,
  pushSuccess:PropTypes.func.isRequired,
  pushError:PropTypes.func.isRequired
}

export default CreateBlogForm;
import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, showDelete, handleBlogUpdate, handleBlogRemove }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);
  const handleLike = (e) => {
    console.log('like button pressed for blog', blog);
    handleBlogUpdate({ ...blog,likes:blog.likes+1 });
  }

  const handleRemove = (e) => {
    console.log('Remove button pressed for blog',blog);
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)){
      handleBlogRemove(blog);
    }
  }

  if(showDetails){
    return (<div className='blog'>
      {blog.title} {blog.author}<button onClick={toggleDetails}>hide</button> <br/>
      {blog.url} <br/>
      likes {blog.likes} <button onClick={handleLike}>like</button> <br/>
      {blog.user.name}
      {showDelete && <><br/><button onClick={handleRemove}>remove</button></>}
    </div>
    )
  }
  else{
    return (
      <div className='blog'>
        {blog.title} {blog.author} <button onClick={toggleDetails}>view</button>
      </div>
    );
  }
}

Blog.propTypes = {
  blog:PropTypes.object.isRequired,
  showDelete:PropTypes.bool.isRequired,
  handleBlogUpdate:PropTypes.func.isRequired,
  handleBlogRemove:PropTypes.func.isRequired
};

export default Blog
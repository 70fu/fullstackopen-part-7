import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  let container;
  let handleBlogUpdateMock;
  let handleBlogRemoveMock;
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user:{
      username:'simon',
      name:'nomis',
      id:'1234567890'
    }
  };

  beforeEach(() => {
    handleBlogUpdateMock=jest.fn();
    handleBlogRemoveMock=jest.fn();
    container = render(<Blog blog={blog} showDelete={true} handleBlogRemove={handleBlogRemoveMock} handleBlogUpdate={handleBlogUpdateMock} />).container;
  });

  test('renders title and author only in hidden mode', () => {
    const blogDiv = container.querySelector('.blog');
    expect(blogDiv).toHaveTextContent(`${blog.title} ${blog.author}`);
    expect(blogDiv).not.toHaveTextContent(blog.url);
    expect(blogDiv).not.toHaveTextContent(blog.user.name);
    expect(blogDiv).not.toHaveTextContent(`likes ${blog.likes}`);
  });

  test('renders url and likes when view button is pressed', async () => {
    const viewButton = screen.getByText('view');
    await userEvent.click(viewButton);

    const blogDiv = container.querySelector('.blog');
    expect(blogDiv).toHaveTextContent(`${blog.title} ${blog.author}`);
    expect(blogDiv).toHaveTextContent(blog.url);
    expect(blogDiv).toHaveTextContent(blog.user.name);
    expect(blogDiv).toHaveTextContent(`likes ${blog.likes}`);
  });

  test('like button clicks are registered', async () => {
    const CLICK_COUNT = 2;
    const viewButton = screen.getByText('view');
    await userEvent.click(viewButton);

    const likeButton = screen.getByText('like');
    for (let i = 0; i < CLICK_COUNT; i++) {
      await userEvent.click(likeButton);
    }

    expect(handleBlogUpdateMock.mock.calls).toHaveLength(CLICK_COUNT);
    expect(handleBlogUpdateMock.mock.calls[0][0].likes).toBe(blog.likes+1);
  })
})
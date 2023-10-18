import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import CreateBlogForm from './CreateBlogForm'
import userEvent from '@testing-library/user-event'

describe('<CreateBlogForm />', () => {
  let container;
  let addBlogMock;
  let pushSuccessMock;
  let pushErrorMock;
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/'
  };

  beforeEach(() => {
    addBlogMock=jest.fn();
    pushSuccessMock=jest.fn();
    pushErrorMock=jest.fn();
    container = render(<CreateBlogForm addBlog={addBlogMock} pushSuccess={pushSuccessMock} pushError={pushErrorMock} />).container;
  });

  test('submitting form calls addBlog with correct arguments', async () => {
    const titleInput = screen.getByLabelText('title:');
    const authorInput = screen.getByLabelText('author:');
    const urlInput = screen.getByLabelText('url:');
    await userEvent.type(titleInput, blog.title);
    await userEvent.type(authorInput, blog.author);
    await userEvent.type(urlInput, blog.url);

    const createButton = screen.getByText('create');
    await userEvent.click(createButton);

    expect(addBlogMock.mock.calls).toHaveLength(1);
    expect(addBlogMock.mock.calls[0][0]).toEqual(blog);
  });
})
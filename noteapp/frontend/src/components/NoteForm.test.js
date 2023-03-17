import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import NoteForm from './NoteForm';

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = jest.fn();
  const user = userEvent.setup();

  render(<NoteForm createNote={createNote} />);

  const input = screen.getByRole('textbox');
  const sendButton = screen.getByText('save');

  await user.type(input, 'testing a form...');
  await user.click(sendButton);

  expect(createNote).toBeCalledTimes(1);
  expect(createNote).toBeCalledWith(
    expect.objectContaining({
      content: 'testing a form...',
    })
  );
});

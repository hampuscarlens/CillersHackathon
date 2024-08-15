import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  ITEMS,
} from '../graphql/items'  // maybe change


const TextInputForm: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
          const response = await sendTextToBackend(inputText);
          setResponseMessage(response.message);
          setResponseText(response.text);
      } catch (error) {
        console.error('Error:', error);
        setResponseMessage(`Error sending text to backend: ${(error as Error).message}`);
     }
  };

  const sendTextToBackend = async (text: string): Promise<{ message: string; text: string }> => {
      const response = await fetch('http://localhost:4000/api/submit-text', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      return response.json();
  };

  return (
      <form onSubmit={handleSubmit}>
          <input
              type="text"
              value={inputText}
              onChange={handleChange}
              placeholder="Enter text"
              required
          />
          <button type="submit">Submit</button>
          {responseMessage && <p>{responseMessage}</p>}
          <div>
            {responseText}
          </div>
      </form>
  );
};

export default TextInputForm;


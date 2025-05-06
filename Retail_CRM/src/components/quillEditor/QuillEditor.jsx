import React, { useEffect, useRef, useState } from 'react';
import 'quill/dist/quill.snow.css'; // Import Quill styles
import Quill from 'quill';
import { Box } from '@mui/material';
import DOMPurify from 'dompurify';
const QuillEditor = ({ value, setEditorContent }) => {
  const [quill, setQuill] = useState(null);
  const editorRef = useRef(null);  // Create a reference for the editor container
  const toolbarOptions = [
    ['bold', 'italic', 'underline'],        // toggled buttons
    // ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    // [{ 'font': [] }],
    // [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];
  useEffect(() => {
    // Ensure that Quill is only instantiated after the component is mounted
    if (editorRef.current) {
      const localQuill = new Quill(editorRef.current,
        {
          modules: {
            toolbar: toolbarOptions
          },
          theme: 'snow',

        });
        setQuill(localQuill);

      // Listen to text-change event and update the state
      localQuill.on('text-change', () => {
        const sanitizedContent = DOMPurify.sanitize(localQuill.root.innerHTML);
        setEditorContent(sanitizedContent);  // Get the content as HTML
      });

      // Clean up Quill instance on unmount
      return () => {
        localQuill.off('text-change');
        setQuill(null);
      };
    }
  }, []);
  useEffect(() => {
    if (value != "") {
      const sanitizedContentFromAPI = DOMPurify.sanitize(value);
      quill.root.innerHTML = sanitizedContentFromAPI;  // Set the API content directly
    }

  }, [value])
  return (
    <Box>
      <Box ref={editorRef} style={{ height: '300px' }}>
      </Box>
    </Box>
  );
};

export default QuillEditor;

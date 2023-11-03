import { Box } from 'grommet';
import { useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import './statements.css';
import { useThemeContext } from '../../components/app';

export const StatementEditable = (props: { placeholder?: string }) => {
  const { constants } = useThemeContext();
  const [text, setText] = useState<string>();

  useEffect(() => {
    const LinkBlot = Quill.import('formats/link');

    class CustomLinkBlot extends LinkBlot {
      static create(value: any) {
        let node = super.create(value);
        value = this.sanitize(value);

        node.setAttribute('href', value);
        // If link does not start with 'http://' or 'https://', prepend 'http://'
        if (!/^https?:\/\//i.test(value)) {
          node.setAttribute('href', `http://${value}`);
        }
        return node;
      }
    }

    Quill.register(CustomLinkBlot, true);
  }, []);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'], // toggled buttons
      ['link'], // link button
    ],
  };

  return (
    <Box
      style={{
        backgroundColor: constants.colors.primary,
        color: constants.colors.textOnPrimary,
        fontSize: '48px',
        borderRadius: '6px',
      }}
      pad="small">
      <Box>
        <ReactQuill
          placeholder={props.placeholder}
          theme="bubble"
          modules={modules}
          value={text}
          onChange={setText}
          readOnly={false}
        />
      </Box>
    </Box>
  );
};

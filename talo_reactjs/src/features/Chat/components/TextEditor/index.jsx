import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

TextEditor.propTypes = {
    showFormat: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    showLike: PropTypes.func,
    onSetValue: PropTypes.func,
    valueHtml: PropTypes.string,
};

TextEditor.defaultProps = {
    showFormat: null,
    onBlur: null,
    onFocus: null,
    showLike: null,
    onSetValue: null,
    valueHtml: '',
};
const style_MainEditor = {
    minHeight: '122px',
};
function TextEditor(props) {
    const { showFormat, onBlur, onFocus, showLike, valueHtml, onSetValue } =
        props;

    const ref = useRef();

    const formats = [
        [{ header: '1' }, { header: '2' }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
        ],
    ];
    const handleOnBlur = () => {
        if (onBlur) {
            onBlur();
        }
    };
    const handleFocus = () => {
        if (onFocus) {
            onFocus();
        }
    };
    const regEx = new RegExp('^(<p><br></p>)+$');
    const handleOnChange = (content) => {
        if (onSetValue) {
            onSetValue(content);
        }
        if (showLike && !regEx.test(content)) {
            showLike(false);
        } else {
            showLike(true);
        }
    };

    return (
        <div id="text-editor" style={showFormat ? style_MainEditor : undefined}>
            <ReactQuill
                ref={ref}
                value={valueHtml}
                placeholder="Nhập tin nhắn"
                onChange={handleOnChange}
                onBlur={handleOnBlur}
                onFocus={handleFocus}
                modules={{ toolbar: showFormat ? formats : false }}
                style={{ border: 'none', outline: 'none' }}
            />
        </div>
    );
}

export default TextEditor;

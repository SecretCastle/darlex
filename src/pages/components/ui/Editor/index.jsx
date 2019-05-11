/* eslint-disable no-console */

import React from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import defaultConfig from './config/defaultConfig';

const editor = React.createRef();
// const toolBar = React.createRef();
// const Fragment = React.Fragment;

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this._quill = null;
        this.state = {
            rangeIndex: 0
        };
    }
    /**
     * initial Quill
     */
    initQuill() {
        if (this._quill === null && editor) {
            // init configuration
            const opt = this.createOptions();
            // init instance
            this._quill = new Quill(editor.current, opt);
            // bind events
            this.bindEvents();
        }
    }
    // bind events
    bindEvents() {
        // bind text-change event
        this._bindChange();
        // bind selection-change event
        this._bindSelectChange();
    }
    // text-change event
    _bindChange() {
        this._quill.on('text-change', () => {
            let html = editor.current.children[0].innerHTML;
            const text = this._quill.getText();
            if (html === '<p><br></p> ') {
                html = '';
            }
            // callback
            this.props.onTextChange({ content: html, text });
        });
    }
    // selection-change event
    _bindSelectChange() {
        this._quill.on('selection-change', () => {
            // select change
            console.log('select change');
        });
    }
    // initial configuration
    createOptions() {
        // merge configuration
        const options = Object.assign({}, defaultConfig, this.props.options);
        return options;
    }
    componentDidMount() {
        // init quill
        this.initQuill();
    }
    componentWillUnmount() {
        // cancel mounted, set null
        this._quill = null;
    }
    render() {
        return (
            <div ref={editor}></div>
        );
    }
}

// init default props type
Editor.propTypes = {
    options: PropTypes.object,
    onTextChange: PropTypes.func.isRequired
};

Editor.defaultProps = {
    options: {}
};

export default Editor;

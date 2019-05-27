/* eslint-disable no-console */
import React from 'react';
import Editor from '@/pages/components/ui/Editor';

// styles
const styles = {
    wrapper: {
        width: '1200px',
        margin: '0 auto'
    }
};

class EditorDemo extends React.Component {
    textChange = ({ content }) => {
        console.log(content );
    }
    render() {
        return (
            <div style={styles.wrapper}>
                <Editor onTextChange={this.textChange}/>

            </div>
        );
    }
}

export default EditorDemo;

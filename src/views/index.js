/* eslint-disable no-unused-vars */
import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import LazyComponent from '@/pages/components/ui/Lazyload';
import Welcome from '@/pages/index';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';
import '@/assets/style';

const Editor = LazyComponent(() => import('@/pages/components/Editor'), <div>loading...</div>);
const DragE = LazyComponent(() => import('@/pages/components/DragE'), <div>loading...</div>);

const App = () => {
    return (
        <Router>
            <header>
                <nav>
                    <Link to="/" alt="Home" title="Home">Home</Link>
                    <Link to="/editor" alt="富文本编辑器" title="富文本编辑器">Editor</Link>
                    <Link to="/dragE" alt="元素拖拽" title="元素拖拽">DragE</Link>
                </nav>
            </header>
            <section>
                <Route path="/" exact component={Welcome} />
                <Route path="/editor" component={Editor} />
                <Route path="/dragE" component={DragE} />
            </section>
        </Router>
    );
};

ReactDOM.render(
    <App />,
    document.getElementById('app')
);

// 热加载
if (module.hot) {
    module.hot.accept();
}

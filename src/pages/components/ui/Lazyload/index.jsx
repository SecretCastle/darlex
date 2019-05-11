import React from 'react';
const lazy = React.lazy;
const Suspense = React.Suspense;

export default (component, loading) => {
    // 简单的定义一个lazyload
    const LazyComponent = lazy(component);
    // 返回新的组件
    return class LazyloadComponent extends React.Component {
        render() {
            return (
                <Suspense fallback={loading}>
                    <LazyComponent />
                </Suspense>
            );
        }
    };
};

/* eslint-disable no-console */
import React from 'react';
import styles from './index.less';

const fatherDom = React.createRef();

class DragEDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                { id: 1, name: 'li_1', color: 'green' },
                { id: 2, name: 'li_2', color: 'red' },
                { id: 3, name: 'li_3', color: 'blue' },
                { id: 4, name: 'li_4', color: 'green' },
                { id: 5, name: 'li_5', color: 'red' },
                { id: 6, name: 'li_6', color: 'blue' },
                { id: 7, name: 'li_7', color: 'green' },
                { id: 8, name: 'li_8', color: 'red' }
            ]
        };
        this.timer = null; // 鼠标点击下去的计时器
        this.setDataTimer = null; // 重置data的debounce timer
        this.dom = null; // 鼠标拖动的dom
        this.domIdx = null; // 移动的dom的下标
        this.targetDomIdx = null; // 目标dom的下标
        this.isMoved = false; // 是否移动了位子
    }
    // 鼠标按钮点击下后触发
    mouseDown = e => {
        this.dom = e.target;
        const start = new Date().getTime();
        // 鼠标按下后，清除设置data的timer
        clearTimeout(this.setDataTimer);
        this.timer = setInterval(() => {
            const now = new Date().getTime();
            // 如果现在的时间和按下屏幕时的时间相差大于300ms，则置为
            if (now - start > 300) {
                // 增加moveable效果
                this.dom.classList.add(styles.setMoveable);
                // 设置draggable属性
                this.dom.setAttribute('draggable', true);
                // 清除timer
                clearInterval(this.timer);
                // 给dom绑定事件
                // this.bindDragEvent(this.dom);
            }
        }, 100);
    }
    // 鼠标按钮松开
    mouseUp = () => {
        // 移除moveable效果
        this.dom.classList.remove(styles.setMoveable);
        // 移除draggable属性
        this.dom.setAttribute('draggable', false);
        // 清楚timer
        clearInterval(this.timer);
        // 取消dom绑定事件
        // this.unBindDragEvent(this.dom);
        // 如果这里移动了元素
        // 这里做比较操作，重新定义state.data, debounce处理，1s后执行，如果1s重复触发，则清除timeout
        if (this.isMoved) {
            this.setDataTimer = setTimeout(() => {
                // 重置state.data
                this.resetData();
                // dom滞空
                this.dom = null;
            }, 1000);
        }

    }
    // 元素拖动start
    dragStart = e => {
        console.log('dragStart');
        this.dom.style.opacity = '0';
        const parentNode = e.target.parentNode.childNodes;
        const domIdx = this.getNodeIndexInNodeList(parentNode, e.target);
        this.domIdx = domIdx;
    }
    // 元素拖动中
    drag = e => {
        e.preventDefault();
    }
    // 元素拖动结束
    dragEnd = e => {
        e.preventDefault();
        this.dom.style.opacity = '1';
        // 重置li样式
        this.mouseUp();
    }
    // 进入目标dom
    // 目前只考虑，单个替换
    dragEnter = e => {
        // 获取当前目标元素的父元素
        this.moveElement(e);
    }
    // 离开目标dom
    dragLeave = () => {
        // code
    }
    // 放置于目标dom
    dropElement = e => {
        e.preventDefault();
        console.log(e.target);
        // 移动dom
        this.movedElement(e);
    }
    moveElement(e) {
        // 获取移动的dragged
        const dragged = this.dom;
        // 获取目标dom
        const target = e.target;
        // 获取父节点的所有nodeList
        const parentNode = target.parentNode;
        // 获取父元素下的全部子元素
        const parentNodeChild = target.parentNode.childNodes;
        const targetIdx = this.getNodeIndexInNodeList(parentNodeChild, target);
        // 设置目标dom的下标
        this.targetDomIdx = targetIdx;
        // 移除dragged
        dragged.remove();
        // 把dragged插入到目标元素之前
        parentNode.insertBefore(dragged, parentNodeChild[targetIdx]);
    }
    /**
     * move 元素
     * @param {*} e
     * 原理：
     * 1、获取移动的dragged
     * 2、获取目标dom
     * 3、获取父节点所有的nodeList
     * 4、获取目标dom的下标
     * 5、移除dragged
     * 6、在目标dom前插入dragged
     */
    movedElement(e) {
        // 获取移动的dragged
        const dragged = this.dom;
        // 获取目标dom
        const target = e.target;
        // 获取父节点的所有nodeList
        const parentNode = target.parentNode;
        // 获取父元素下的全部子元素
        const parentNodeChild = target.parentNode.childNodes;
        const targetIdx = this.getNodeIndexInNodeList(parentNodeChild, target);
        // 设置目标dom的下标
        this.targetDomIdx = targetIdx;
        // 如果移动了，则设置isMove为true
        if (this.targetDomIdx !== this.domIdx) {
            this.isMoved = true;
            // 移除dragged
            dragged.remove();
            // 把dragged插入到目标元素之前
            parentNode.insertBefore(dragged, parentNodeChild[targetIdx]);
        } else {
            this.isMoved = false;
        }

    }
    // 重置data，并且赋值state
    resetData() {
        const data = this.state.data;
        const moveData = data[this.domIdx];
        const targetIdx = this.targetDomIdx;
        // 删除原数组中移动的元素的
        data.splice(this.domIdx, 1);
        // 在新的target中插入移动的元素的
        data.splice(targetIdx, 0, moveData);
        this.setState({
            data
        });
        this.isMoved = false;
    }
    dragOver = e => {
        e.preventDefault();
    }
    // 绑定drag事件
    bindDragEvent(dom) {
        // 绑定dom的dragstart
        dom.addEventListener('dragstart', this.dragStart, false);
        // 绑定dom的drag
        dom.addEventListener('drag', this.drag, false);
        // 绑定dom的dragend
        dom.addEventListener('dragend', this.dragEnd, false);
        // 绑定dom的dragenter
        dom.addEventListener('dragenter', this.dragEnter, false);
        // 绑定dom的dragleave
        dom.addEventListener('dragleave', this.dragLeave, false);
        // 绑定dom的drop，在目标中元素中放下
        dom.addEventListener('drop', this.dropElement, false);
        // 设置dragover，目标可触发drop
        dom.addEventListener('dragover', this.dragOver, false);
    }
    // 取消绑定drag事件
    unBindDragEvent(dom) {
        dom.removeEventListener('dragstart', this.dragStart, false);
        dom.removeEventListener('drag', this.drag, false);
        dom.removeEventListener('dragend', this.dragEnd, false);
        dom.removeEventListener('dragenter', this.dragEnter, false);
        dom.removeEventListener('dragleave', this.dragLeave, false);
        dom.removeEventListener('drop', this.dropElement, false);
        dom.removeEventListener('dragOver', this.dragOver, false);
    }
    // 获取nodelist中node的下标
    getNodeIndexInNodeList(nodeList, node) {
        let index = 0;
        for(let idx = 0; idx < nodeList.length; idx++) {
            const nodeItem = nodeList[idx];
            if (node.className === nodeItem.className) {
                index = idx;
            }
        }
        return index;
    }
    componentDidMount() {
        this.bindDragEvent(fatherDom.current);
    }
    componentWillUnmount() {
        this.unBindDragEvent(fatherDom.current);
    }
    render() {
        console.log(this.state.data);
        return (
            <div
                className={styles.divList}
                ref={fatherDom}
            >
                {
                    this.state.data.map((item) =>
                        <li
                            onMouseDown={this.mouseDown}
                            onMouseUp={this.mouseUp}
                            className={`${styles[item.color]} liZone_${item.id}`}
                            key={'li_' + item.id}
                        >{item.id}</li>
                    )
                }
            </div>
        );
    }
}

export default DragEDemo;

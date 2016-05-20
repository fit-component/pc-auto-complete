import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as classNames from 'classnames'
import Input from '../../../input/src'
import * as module from './module'
import {others} from '../../../../common/transmit-transparently/src'
import * as $ from 'jquery'
import './index.scss'
import Element = JSX.Element;

let interval: any = null

const reg = (input: string) => {
    let flags = 'g'
    return new RegExp(input, flags)
}

export default class AutoComplete extends React.Component<module.PropsInterface, module.StateInterface> {
    static defaultProps = new module.Props()
    public state = new module.State()
    private searchValue: string
    private handleDocumentClick: any
    private _isMounted: boolean
    private dom: any

    constructor(props: any) {
        super(props)
    }

    componentWillMount() {
        this.dom = ReactDOM.findDOMNode(this)
        this._isMounted = true
        // 点击document
        this.handleDocumentClick = (event: any)=> {
            if (!this._isMounted)return
            if (!$.contains(this.dom, event.target)) {
                this.setState({
                    showComplete: false
                })
            }
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.dom = ReactDOM.findDOMNode(this)
        $(document).on('click', this.handleDocumentClick)
    }

    componentWillUnmount() {
        this._isMounted = false
        $(document).off('click', this.handleDocumentClick)
    }

    handleFocus() {
        this.setState({
            showComplete: true
        })
    }

    handleChange(event: any) {
        let value = event.target.value

        this.setState({
            value: value
        })
        this.searchValue = value

        if (this.props.url !== '') {
            clearInterval(interval)
            interval = setTimeout(() => {
                $.ajax({
                    url: this.props.url,
                    method: this.props.method,
                    data: this.props.beforeSend(value)
                }).done((res) => {
                    let datas = this.props.complete(res)
                    this.setState({
                        datas: datas,
                        filterDatas: this.filterDatas(datas),
                        selectIndex: -1,
                        showComplete: true
                    })
                })
            }, this.props.delay)
        } else {
            this.setState({
                datas: this.props.datas,
                filterDatas: this.filterDatas(this.props.datas),
                selectIndex: -1,
                showComplete: true
            })
        }
    }

    filterDatas(datas: any) {
        let newDatas: any = []

        let count = 0
        datas.map((item: any, index: number) => {
            let regex = reg(this.searchValue)
            if (this.searchValue === '' || (this.props.autoFilter && !regex.test(item[this.props.parse.text]))) {
                return
            }

            count++

            // 超过最大数量则取消显示
            if (count > this.props.maxNumber) {
                return
            }

            newDatas.push(item)
        })

        return newDatas
    }

    handleSelect(text: string, value: string, index: any, close: boolean = true, realSelect: boolean = false) {
        this.setState({
            value: text,
            selectIndex: index,
            showComplete: !close
        }, () => {
            if (realSelect) {
                this.props.onSelect(value)
            }
        })
    }

    handleKeyDown(event: any) {
        if (this.state.filterDatas.length === 0) return

        switch (event.keyCode) {
            case 40: // 上
                let newUpIndex = this.state.selectIndex + 1
                if (newUpIndex > this.state.filterDatas.length - 1) {
                    newUpIndex = 0
                }
                this.handleSelect(this.state.filterDatas[newUpIndex][this.props.parse.text], this.state.filterDatas[newUpIndex][this.props.parse.value], newUpIndex, false, false)
                break
            case 38: // 下
                let newDownIndex = this.state.selectIndex - 1
                if (newDownIndex < 0) {
                    newDownIndex = this.state.filterDatas.length - 1
                }
                this.handleSelect(this.state.filterDatas[newDownIndex][this.props.parse.text], this.state.filterDatas[newDownIndex][this.props.parse.value], newDownIndex, false, false)
                break
            case 13: // enter
                // 如果所填没有在显示列表里,则无效
                let hasFind = false
                this.state.filterDatas.map((item) => {
                    if (item[this.props.parse.text] === this.state.value) {
                        hasFind = true
                    }
                })
                if (!hasFind) return

                this.handleSelect(this.state.filterDatas[this.state.selectIndex][this.props.parse.text], this.state.filterDatas[this.state.selectIndex][this.props.parse.value], this.state.selectIndex, true, true)
        }
    }

    innerRender(items: any, isEmpty: boolean) {
        const style = {
            display: this.state.showComplete && !isEmpty ? 'block' : null
        }
        return (
            <div className="complete-container"
                 style={style}>
                {items}
            </div>
        )
    }

    render() {
        const {className, parse} = this.props
        const classes = classNames({
            '_namespace': true,
            [this.props['className']]: !!this.props['className']
        })

        // 是否为空
        let isEmpty = true

        let Items = this.state.filterDatas.map((item, index)=> {
            let itemClass = classNames({
                'item': true,
                'active': index === this.state.selectIndex
            })

            let regex = reg(this.searchValue)
            let matchedString = item[parse.text].replace(regex, '<span class="autocomplete-highlight">' + this.searchValue + '</span>')

            isEmpty = false

            return (
                <div onClick={this.handleSelect.bind(this, item[parse.text], item[parse.value], index, true, true) }
                     key={index}
                     className={itemClass}
                     dangerouslySetInnerHTML={{ __html: matchedString }}></div>
            )
        })

        const _others = others(new module.Props(), this.props)

        return (
            <Input {..._others}
                className={classes}
                onFocus={this.handleFocus.bind(this) }
                value={this.state.value}
                onKeyDown={this.handleKeyDown.bind(this) }
                onChange={this.handleChange.bind(this) }
                innerRender={this.innerRender.bind(this, Items,isEmpty) }
                autocomplete={false}/>
        )
    }
}
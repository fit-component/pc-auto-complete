import React from 'react'
import classNames from 'classnames'
import Input from 'fit-input'
import $ from 'jquery'
import './index.scss'

let interval = null

const reg = (input)=> {
    let flags = 'g'
    return new RegExp(input, flags)
}

export default class AutoComplete extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputWidth: 0,
            showComplete: false,

            // 预设或者是后端返回的全部datas
            datas: [],

            // 去重后的datas
            filterDatas: [],

            value: '',

            // 当前选中第几个
            selectIndex: -1
        }

        // 点击document
        this.handleDocumentClick = (event)=> {
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
            inputWidth: $(this.dom).find('#j-input').outerWidth(),
            showComplete: true
        })
    }

    handleChange(value) {
        this.setState({
            value: value
        })
        this.searchValue = value

        if (this.props.url !== '') {
            clearInterval(interval)
            interval = setTimeout(()=> {
                $.ajax({
                    url: this.props.url,
                    method: this.props.method,
                    data: this.props.beforeSend(value)
                }).done((res)=> {
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

    filterDatas(datas) {
        let newDatas = []

        let count = 0
        datas.map((item, index)=> {
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

    handleSelect(text, value, index, close = true, realSelect = false) {
        this.setState({
            value: text,
            selectIndex: index,
            showComplete: !close
        }, ()=> {
            if (realSelect) {
                this.props.onSelect(value)
            }
        })
    }

    handleKeyDown(event) {
        if (this.state.filterDatas.length === 0) return

        switch (event.keyCode) {
        case 40:
            // 上
            let newUpIndex = this.state.selectIndex + 1
            if (newUpIndex > this.state.filterDatas.length - 1) {
                newUpIndex = 0
            }
            this.handleSelect(this.state.filterDatas[newUpIndex][this.props.parse.text], this.state.filterDatas[newUpIndex][this.props.parse.value], newUpIndex, false, false)
            break
        case 38:
            // 下
            let newDownIndex = this.state.selectIndex - 1
            if (newDownIndex < 0) {
                newDownIndex = this.state.filterDatas.length - 1
            }
            this.handleSelect(this.state.filterDatas[newDownIndex][this.props.parse.text], this.state.filterDatas[newDownIndex][this.props.parse.value], newDownIndex, false, false)
            break
        case 13:
            // enter
            this.handleSelect(this.state.filterDatas[this.state.selectIndex][this.props.parse.text], this.state.filterDatas[this.state.selectIndex][this.props.parse.value], this.state.selectIndex, true, true)
        }
    }

    render() {
        // 是否为空
        let isEmpty = true

        let Items = this.state.filterDatas.map((item, index)=> {
            let itemClass = classNames({
                'item': true,
                'active': index === this.state.selectIndex
            })

            let regex = reg(this.searchValue)
            let matchedString = item[this.props.parse.text].replace(regex, '<span class="highlight">' + this.searchValue + '</span>')

            isEmpty = false

            return (
                <div onClick={this.handleSelect.bind(this,item[this.props.parse.text],item[this.props.parse.value],index,true,true)}
                     key={index}
                     className={itemClass}
                     dangerouslySetInnerHTML={{__html: matchedString}}></div>
            )
        })

        let completeContainerStyle = {
            width: this.state.inputWidth,
            display: this.state.showComplete && !isEmpty ? 'block' : null
        }

        return (
            <div className="_namespace">
                <Input onFocus={this.handleFocus.bind(this)}
                       value={this.state.value}
                       onKeyDown={this.handleKeyDown.bind(this)}
                       onChange={this.handleChange.bind(this)}
                       autocomplete={false}
                    {...this.props.inputOpts}/>
                <div className="complete-container"
                     style={completeContainerStyle}>
                    {Items}
                </div>
            </div>
        )
    }
}

AutoComplete.defaultProps = {
    // @desc 本地数据,如果不设置url,则使用此数据模拟查询
    datas: [],

    // @desc 自动筛选,当设置datas时请设置为true,如果服务器返回的结果有杂质需要过滤,也可以设置此参数
    autoFilter: false,

    // @desc 最大显示数量
    maxNumber: 10,

    // @desc 输入框参数
    inputOpts: {},

    // @desc 请求类型
    method: 'get',

    // @desc 访问地址
    url: '',

    // @desc 选中时回调
    onSelect: (value)=> {
    },

    // @desc 发送前执行函数
    beforeSend: (value)=> {
        return value
    },

    // @desc 发送后执行函数
    complete: (res)=> {
        return res
    },

    // @desc 解析后端内容时,显示值(text)与实际值(value)的参数名
    parse: {
        text: 'text',
        value: 'value'
    },

    // @desc 发送延迟
    delay: 0
}
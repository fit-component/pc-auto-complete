import * as React from 'react'
import AutoComplete from '../../src'

const opts = {
    datas: [{
        label: '小明',
        key: 1
    }, {
        label: '小王',
        key: 1
    }, {
        label: '小红',
        key: 1
    }],
    placeholder: '小明 小王 小红',
    parse: {
        text: 'label',
        value: 'key'
    }
}

export default class Demo extends React.Component <any,any> {
    render() {
        return (
            <AutoComplete {...opts}/>
        )
    }
}
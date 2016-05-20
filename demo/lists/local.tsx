import * as React from 'react'
import AutoComplete from '../../src'

const opts = {
    datas: [{
        text: '小明',
        value: 1
    }, {
        text: '小王',
        value: 1
    }, {
        text: '小红',
        value: 1
    }],
    autoFilter: true,
    placeholder: '小明 小王 小红'
}

export default class Demo extends React.Component <any,any> {
    render() {
        return (
            <AutoComplete {...opts}/>
        )
    }
}
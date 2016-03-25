import React from 'react'
import AutoComplete from 'fit-auto-complete'

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
    inputOpts: {
        placeholder: '小明 小王 小红'
    },
    parse: {
        text: 'label',
        value: 'key'
    }
}

export default class Demo extends React.Component {
    render() {
        return (
            <AutoComplete {...opts}/>
        )
    }
}
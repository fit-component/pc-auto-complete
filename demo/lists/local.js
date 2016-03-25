import React from 'react'
import AutoComplete from 'fit-auto-complete'

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
    inputOpts: {
        placeholder: '小明 小王 小红'
    }
}

export default class Demo extends React.Component {
    render() {
        return (
            <AutoComplete {...opts}/>
        )
    }
}
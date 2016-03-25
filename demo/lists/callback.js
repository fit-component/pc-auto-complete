import React from 'react'
import AutoComplete from 'fit-auto-complete'

const opts = {
    url: '/api/auto-complete/basic',
    method: 'get',
    beforeSend: (value)=> {
        return {
            search: value
        }
    },
    complete: (res)=> {
        return res
    },
    delay: 200,
    onSelect: (value)=> {
        console.log(value)
    }
}

export default class Demo extends React.Component {
    render() {
        return (
            <AutoComplete {...opts}/>
        )
    }
}
import { Toolbar, AppBar, Typography, CircularProgress } from '@material-ui/core';
import React from 'react';
import ListItem from './ListItem';

export default function List(props) {

    //console.log(props.notices)

    return (
        <div>
            {props.notices.map(function(d, idx){
                return (<ListItem key={d.notice_id} notice={d}></ListItem>)
            })}
        </div>
    )
}

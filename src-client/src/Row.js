import React, { Component } from 'react'

import Grid from 'material-ui/Grid'
import ReactJson from 'react-json-view'
import { withStyles } from 'material-ui/styles'
import styles from './Row.css'

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';

import moment from 'moment'


class Row extends Component {
  state = {
    slideIndex: 0,
  }

  handleChange = (event, value) => {
    this.setState({
      slideIndex: value,
    });
  }
  handleChangeIndex = index => {
    this.setState({ slideIndex: index });
  };

  render() {
    const {
      request
    } = this.props

    const datetimeStr = moment(request.datetime, 'x').format('DD.MM.YYYY HH:mm:ss:SS')

    return (
      <div className="requestWrapper" >
        <div className='requestWrapper__head'>
          <Grid
            container
            alignItems={'center'}
            direction={'row'}
            justify={'space-between'}
          >
            <Grid item>
              <span className='requestWrapper__head__method'>{ request.method }</span>
              <span>{ request.originalUrl }</span>
            </Grid>
            <Grid item>
              { datetimeStr }
            </Grid>
          </Grid>
        </div>
        <Tabs
          value={this.state.slideIndex}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label="Headers" />
          <Tab label="Body" />
        </Tabs>

        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChangeIndex}
        >
          <div>
            <Table>
              <TableHead adjustForCheckbox={false}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody displayRowCheckbox={false}>
                {
                  Object.keys(request.headers).map(key => <TableRow>
                      <TableCell>{ key }</TableCell>
                      <TableCell>{ request.headers[key] }</TableCell>
                    </TableRow>
                  )
                }
              </TableBody>
            </Table>

          </div>
          <div style={styles.slide}>
            {
              request.body ?
              <ReactJson src={{body: JSON.parse(request.body)}} theme={'monokai'} collapsed={1} />
              :
              <p>No body</p>
            }
          </div>
        </SwipeableViews>

      </div>
    );
  }
}

export default withStyles(styles)(Row)

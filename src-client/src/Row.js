import React, { Component } from 'react'

import Grid from 'material-ui/Grid'
import ReactJson from 'react-json-view'
import { withStyles } from 'material-ui/styles'
import styles from './Row.css'

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'

import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';

import moment from 'moment'

class WiteText extends Component {
  render() {
    return <Typography {...this.props} style={{color:'#fff'}}/>
  }
}
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

    const datetimeStr = moment(request.request.datetime, 'x').format('DD.MM.YYYY HH:mm:ss:SS')

    return (
      <div className="requestWrapper" >
        <ExpansionPanel style={{background:'rgb(39, 40, 34)'}}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon color={ '#fff' }/>}>
            <div className='requestWrapper__head'>
              <Grid
                container
                alignItems={'center'}
                direction={'row'}
                justify={'space-between'}
              >
                <Grid item>
                  <span className='requestWrapper__head__method'>{ request.request.method }</span>
                  <span>{ request.request.originalUrl }</span>
                </Grid>
                <Grid item>
                  { datetimeStr }
                </Grid>
              </Grid>
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
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
                <WiteText>Request</WiteText>
                <Table>
                  <TableHead adjustForCheckbox={false}>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody displayRowCheckbox={false}>
                    {
                      Object.keys(request.request.headers).map(key => <TableRow>
                          <TableCell><WiteText>{ key }</WiteText></TableCell>
                          <TableCell><WiteText>{ request.request.headers[key] }</WiteText></TableCell>
                        </TableRow>
                      )
                    }
                  </TableBody>
                </Table>

                <WiteText>Response</WiteText>

                { request.response ? <Table>
                  <TableHead adjustForCheckbox={false}>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody displayRowCheckbox={false}>
                    {
                      Object.keys(request.response.headers).map(key => <TableRow>
                          <TableCell><WiteText>{ key }</WiteText></TableCell>
                          <TableCell><WiteText>{ request.response.headers[key] }</WiteText></TableCell>
                        </TableRow>
                      )
                    }
                  </TableBody>
                </Table> : 'Нет ответа'
              }



              </div>
              <div style={styles.slide}>
                {
                  request.request.body ?
                  <ReactJson src={{body: JSON.parse(request.request.body)}} theme={'monokai'} collapsed={1} />
                  :
                  <p>No body</p>
                }
              </div>
            </SwipeableViews>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(styles)(Row)

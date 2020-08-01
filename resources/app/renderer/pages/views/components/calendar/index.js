import React from "react";
import moment from "moment";
import {es} from 'moment/locale/es';
import { range } from "moment-range";
moment().locale('es');

export default class Calendar extends React.Component {
  weekdayshort = moment.weekdaysShort();
  
  state = {
    showCalendarTable: true,
    showMonthTable: false,
    dateObject: moment(),
    allmonths: moment.months(),
    showYearNav: false,
    selectedDay: null
  };
  daysInMonth = () => {
    return this.state.dateObject.daysInMonth();
  };
  year = () => {
    return this.state.dateObject.format("Y");
  };
  currentDay = () => {
    return this.state.dateObject.format("D");
  };
  firstDayOfMonth = () => {
    let dateObject = this.state.dateObject;
    let firstDay = moment(dateObject)
      .startOf("month")
      .format("d"); // Day of week 0...1..5...6
    return firstDay;
  };
  month = () => {
    return this.state.dateObject.format("MMMM");
  };
  showMonth = (e, month) => {
    this.setState({
      showMonthTable: !this.state.showMonthTable,
      showCalendarTable: !this.state.showCalendarTable
    });
  };
  setMonth = month => {
    let monthNo = this.state.allmonths.indexOf(month);
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set("month", monthNo);
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showCalendarTable: !this.state.showCalendarTable
    });
  };
  MonthList = props => {
    let months = [];
    props.data.map(data => {
      months.push(
        <td
          key={data}
          className="calendar-month"
          onClick={e => {
            this.setMonth(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    });
    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let monthlist = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });

    return (
      <table className="calendar-month">
        <thead>
          <tr>
            <th colSpan="4">MES</th>
          </tr>
        </thead>
        <tbody>{monthlist}</tbody>
      </table>
    );
  };
  showYearEditor = () => {
    this.setState({
      showYearNav: true,
      showCalendarTable: !this.state.showCalendarTable
    });
  };

  onPrev = () => {
    let curr = "";
    if (this.state.showMonthTable == true) {
      curr = "year";
    } else {
      curr = "month";
    }
    this.setState({
      dateObject: this.state.dateObject.subtract(1, curr)
    });
  };
  onNext = () => {
    let curr = "";
    if (this.state.showMonthTable == true) {
      curr = "year";
    } else {
      curr = "month";
    }
    this.setState({
      dateObject: this.state.dateObject.add(1, curr)
    });
  };
  setYear = year => {
    // alert(year)
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set("year", year);
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable,
      showYearNav: !this.state.showYearNav,
      showMonthTable: !this.state.showMonthTable
    });
  };
  onYearChange = e => {
    this.setYear(e.target.value);
  };
  getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("YYYY"));
      currentDate = moment(currentDate).add(1, "year");
    }
    return dateArray;
  }
  YearTable = props => {
    let months = [];
    let nextten = moment()
      .set("year", props)
      .add("year", 12)
      .format("Y");

    let tenyear = this.getDates(props, nextten);

    tenyear.map(data => {
      months.push(
        <td
          key={data}
          className="calendar-month"
          onClick={e => {
            this.setYear(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    });
    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let yearlist = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });

    return (
      <table className="calendar-month">
        <thead>
          <tr>
            <th colSpan="4">AÑO</th>
          </tr>
        </thead>
        <tbody>{yearlist}</tbody>
      </table>
    );
  };
  onDayClick = (e, d) => {
    this.setState(
      {
        selectedDay: d
      },
      () => {
        console.log("SELECTED DAY: ", this.state.selectedDay);
      }
    );
  };
  render() {
    let weekdayshortname = this.weekdayshort.map(day => {
      return <th key={day}>{day}</th>;
    });
    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(<td className="calendar-day empty">{""}</td>);
    }
    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      let currentDay = d == this.currentDay() ? "today" : "";
      // let selectedClass = (d == this.state.selectedDay ? " selected-day " : "")
      daysInMonth.push(
        <td key={d} className={`calendar-day ${currentDay}`}>
          <span
            onClick={e => {
              this.onDayClick(e, d);
            }}
          >
            {d}
          </span>
        </td>
      );
    }
    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        // let insertRow = cells.slice();
        rows.push(cells);
      }
    });

    let daysinmonth = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });

    return (
      <div>
      <div className="tail-datetime-calendar">
        <div className="calendar-navi">
          <span
            onClick={e => {
              this.onPrev();
            }}
            className="calendar-button button-prev"
          />
          {!this.state.showMonthTable && !this.state.showYearEditor && (
            <span
              onClick={e => {
                this.showMonth();
              }}
              className="calendar-label"
            >
              {this.month()},
            </span>
          )}
          <span
            className="calendar-label"
            onClick={e => {
              this.showYearEditor();
            }}
          >
            {this.year()}
          </span>

          <span
            onClick={e => {
              this.onNext();
            }}
            className="calendar-button button-next"
          />
        </div>
        <div className="calendar-date">
          {this.state.showYearNav && <this.YearTable props={this.year()} />}
          {this.state.showMonthTable && (
            <this.MonthList data={moment.months()} />
          )}
        </div>

        {this.state.showCalendarTable && (
          <div className="calendar-date">
            <table className="calendar-day">
              <thead>
                <tr>{weekdayshortname}</tr>
              </thead>
              <tbody>{daysinmonth}</tbody>
            </table>
          </div>
        )}
      </div>
      <style global jsx>{`
      .tail-datetime-calendar {
          width: 245px;
          height: auto;
          margin: 15px;
          padding: 0;
          display: block;
          overflow: hidden;
          position: absolute;
          border-collapse: separate;
          font-family: "Open Sans", Calibri, Arial, sans-serif;
          background-color: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3125);
          -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3125);
          border-radius: 3px;
          -webkit-border-radius: 3px;
        }
        .tail-datetime-calendar:after {
          clear: both;
          content: "";
          display: block;
          font-size: 0;
          visibility: hidden;
        }
        .tail-datetime-calendar.calendar-static {
          margin-left: auto;
          margin-right: auto;
        }
        .tail-datetime-calendar .calendar-navi {
          width: 100%;
          margin: 0;
          padding: 0;
          display: table;
          border-spacing: 0;
          border-collapse: separate;
          background-color: #cd283c;
          border-radius: 3px 3px 0 0;
          -webkit-border-radius: 3px 3px 0 0;
        }
        .tail-datetime-calendar .calendar-navi span {
          cursor: pointer;
          color: #fff;
          margin: 0;
          padding: 0;
          display: table-cell;
          font-size: 14px;
          text-align: center;
          line-height: 30px;
          text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.15);
          background-repeat: no-repeat;
          background-position: center center;
        }
        .tail-datetime-calendar .calendar-navi span:first-child,
        .tail-datetime-calendar .calendar-navi span:last-child {
          width: 35px;
          padding: 0 0 5px 0;
          font-size: 22px;
        }
        .tail-datetime-calendar .calendar-navi span:hover {
          background-color: rgba(0, 0, 0, 0.15);
        }
        .tail-datetime-calendar .calendar-navi span.button-prev {
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC\
            9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgNiAxNiI+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iT\
            TYgMkwwIDhsNiA2VjJ6Ii8+PC9zdmc+");
        }
        .tail-datetime-calendar .calendar-navi span.button-next {
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC\
            9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgNiAxNiI+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iT\
            TAgMTRsNi02LTYtNnYxMnoiLz48L3N2Zz4=");
        }
        .tail-datetime-calendar .calendar-navi span.button-check {
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC\
            9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDEyIDE2Ij48cGF0aCBmaWxsPSIjZmZmZmZmIiBkP\
            SJNMTIgNWwtOCA4LTQtNCAxLjUtMS41TDQgMTBsNi41LTYuNUwxMiA1eiIvPjwvc3ZnPg==");
        }
        .tail-datetime-calendar .calendar-navi span.button-close {
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC\
            9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDEyIDE2Ij48cGF0aCBmaWxsPSIjZmZmZmZmIiBkP\
            SJNNy40OCA4bDMuNzUgMy43NS0xLjQ4IDEuNDhMNiA5LjQ4bC0zLjc1IDMuNzUtMS40OC0xLjQ4TDQuNTIgOCAuNzcgNC4y\
            NWwxLjQ4LTEuNDhMNiA2LjUybDMuNzUtMy43NSAxLjQ4IDEuNDhMNy40OCA4eiIvPjwvc3ZnPg==");
        }
        .tail-datetime-calendar .calendar-date {
          margin: 0;
          padding: 0;
          display: block;
        }
        .tail-datetime-calendar .calendar-date table {
          width: 100%;
          margin: 0;
          padding: 0;
          border-spacing: 0;
          border-collapse: collapse;
        }
        .tail-datetime-calendar .calendar-date table thead tr > *,
        .tail-datetime-calendar .calendar-date table tbody tr > * {
          color: #ffffff;
          width: 35px;
          height: 35px;
          padding: 0;
          font-size: 12px;
          text-align: center;
          font-weight: normal;
          line-height: 35px;
          border: 0;
          background-color: #223344;
        }
        .tail-datetime-calendar .calendar-date table tbody tr > * {
          color: #334455;
          cursor: pointer;
          position: relative;
          font-size: 14px;
          background-color: #ffffff;
        }
        .tail-datetime-calendar .calendar-date table tbody tr > * > span {
          color: inherit;
          z-index: 10;
          position: relative;
        }
        /* Select a Day */
        .tail-datetime-calendar .calendar-date table tbody tr > *::after {
          top: 3px;
          left: 3px;
          width: 29px;
          height: 29px;
          content: "";
          display: block;
          position: absolute;
          border-width: 1px;
          border-style: solid;
          border-color: transparent;
          border-radius: 50%;
          -webkit-border-radius: 50%;
        }
        .tail-datetime-calendar .calendar-date table tbody tr > *.today {
          color: #3296c8;
        }
        .tail-datetime-calendar .calendar-date table tbody tr > *.today:after {
          border-color: #3296c8;
        }
        .tail-datetime-calendar .calendar-date table tbody tr > *:hover {
          color: #cd283c;
        }
        .tail-datetime-calendar .calendar-date table tbody tr > *:hover:after {
          border-color: #cd283c;
        }
        .tail-datetime-calendar .calendar-date table tbody tr > *.empty,
        .tail-datetime-calendar .calendar-date table tbody tr > *.disable {
          color: #8899aa;
          cursor: not-allowed;
          background-color: #efefef;
        }
        .tail-datetime-calendar .calendar-date table tbody tr > *.empty:hover:after,
        .tail-datetime-calendar .calendar-date table tbody tr > *.disable:hover:after {
          content: "";
          display: none;
        }
        .tail-datetime-calendar .calendar-date table tbody tr > *.current span {
          color: #fff;
        }
        .tail-datetime-calendar .calendar-date table tbody tr > *.current:after {
          border-color: #3296c8;
          background-color: #3296c8;
        }
        /* Select A Month */
        .tail-datetime-calendar .calendar-date table.calendar-month tbody tr > * {
          width: 81.66666666666667px;
          padding: 5px;
          line-height: 25px;
        }
        .tail-datetime-calendar .calendar-date table.calendar-month tbody tr > * span {
          display: block;
          border-width: 1px;
          border-style: solid;
          border-color: transparent;
          border-radius: 3px;
          -webkit-border-radius: 3px;
        }
        .tail-datetime-calendar
          .calendar-date
          table.calendar-month
          tbody
          tr
          > *:hover
          span {
          border-color: #d0d0d0;
          box-shadow: 0 1px 0 0 #efefef;
          -webkit-box-shadow: 0 1px 0 0 #efefef;
        }
        /* Select a Time */
        .tail-datetime-calendar .calendar-time {
          width: 100%;
          margin: 0;
          padding: 0;
          display: table;
          text-align: center;
          background-color: #ffffff;
          border-radius: 0 0 3px 3px;
          -webkit-border-radius: 0 0 3px 3px;
        }
        .tail-datetime-calendar .calendar-date + .calendar-time {
          border-top: 1px solid #d0d0d0;
          background-color: #f8f8f8;
        }
        .tail-datetime-calendar .calendar-time .calendar-field {
          width: 33.3333333333%;
          padding: 10px 0;
          display: table-cell;
          position: relative;
          text-align: center;
          vertical-align: top;
        }
        .tail-datetime-calendar .calendar-time .calendar-field:first-child {
          text-align: right;
        }
        .tail-datetime-calendar .calendar-time .calendar-field:first-child:after {
          top: 12px;
          right: -10px;
          content: ":";
          position: absolute;
        }
        .tail-datetime-calendar .calendar-time .calendar-field:last-child {
          text-align: left;
        }
        .tail-datetime-calendar .calendar-time .calendar-field:last-child:after {
          top: 12px;
          left: -10px;
          content: ":";
          position: absolute;
        }
        .tail-datetime-calendar .calendar-time .calendar-field input[type="number"] {
          width: 100%;
          max-width: 50px;
          margin: 0;
          padding: 3px 4px;
          font-size: 12px;
          line-height: 16px;
          text-align: center;
          border-width: 1px;
          border-style: solid;
          border-color: #d0d0d0;
          background-color: #ffffff;
          border-radius: 3px;
          -webkit-border-radius: 3px;
        }
        .tail-datetime-calendar
          .calendar-time
          .calendar-field
          input[type="number"]:hover {
          border-color: #a0a0a0;
        }
        .tail-datetime-calendar
          .calendar-time
          .calendar-field
          input[type="number"]:focus {
          border-color: #3296c8;
        }
        .tail-datetime-calendar .calendar-time .calendar-field label {
          color: #778899;
          margin: 5px 0 0 0;
          padding: 0;
          display: block;
          font-size: 12px;
          line-height: 12px;
        }
      `}</style>
      </div>
    );
  }
}
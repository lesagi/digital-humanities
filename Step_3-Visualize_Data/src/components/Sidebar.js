import React, { useRef } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { FormControl, Button, Chip } from "@material-ui/core";
import {
  AddCircle,
  ArrowUpward,
  ArrowDownward,
  GetApp,
} from "@material-ui/icons";

import "./Sidebar.css";

const Sidebar = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  addDateSubmissionHandler,
  removeDateHandler,
  keys,
  setKeys,
  onKeyClickHandlerCtor,
  sortingKey,
  isDescOrder,
}) => {
  const aRef = useRef(null);
  const exportToCsvHandler = () => {
    const datesString = keys
      .map((key) =>
        key
          .split("-")
          .map((date) => date.split("/").join("-"))
          .join(",")
      )
      .join(";");
    aRef.current.href = `http://localhost:5000//data?format=csv&dates=${datesString}`;
    aRef.current.click();
  };
  return (
    <div className="sidebar-container">
      <div id="add-dates">
        <h1>Add Dates</h1>
        <FormControl>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className="date-picker">
              <KeyboardDatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                label="Start Date"
                format="DD/MM/yyyy"
                value={startDate}
                InputAdornmentProps={{ position: "start" }}
                onChange={(date) => setStartDate(date)}
                required
              />
            </div>
            <div className="date-picker">
              <KeyboardDatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                label="End Date"
                format="DD/MM/yyyy"
                value={endDate}
                InputAdornmentProps={{ position: "start" }}
                onChange={(date) => setEndDate(date)}
                required
              />
            </div>
          </MuiPickersUtilsProvider>
          <div id="add-date-area">
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<AddCircle>Send</AddCircle>}
              onClick={addDateSubmissionHandler}
            >
              Add Date
            </Button>
          </div>
        </FormControl>
        <hr />
      </div>
      <div className="dates-control">
        <h1>Dates</h1>
        <div id="csv-download-btn">
          <Button
            component="span"
            size="small"
            startIcon={<GetApp></GetApp>}
            onClick={exportToCsvHandler}
          >
            CSV
          </Button>
          <a ref={aRef}></a>
        </div>
        <div className="keys-list">
          {keys.map((key, ind) => {
            return (
              <Chip
                key={key}
                size="small"
                className="date-key"
                icon={
                  sortingKey === key && isDescOrder ? (
                    <ArrowDownward />
                  ) : (
                    <ArrowUpward />
                  )
                }
                label={key}
                onClick={onKeyClickHandlerCtor(key)}
                onDelete={removeDateHandler}
              />
            );
          })}
        </div>
      </div>

      <h4 id="credits">
        Project was made by Sagi Levi |{" "}
        <a href="mailto:lesagi@gmail.com">lesagi@gmail.com</a> |{" "}
        <a href="https://github.com/lesagi">https://github.com/lesagi</a>
      </h4>
    </div>
  );
};

export default Sidebar;

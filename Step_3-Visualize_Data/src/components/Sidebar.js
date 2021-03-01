import React, { useState } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  Button,
  Chip,
  Icon,
} from "@material-ui/core";

import { AddCircle, ArrowUpward, ArrowDownward } from "@material-ui/icons";

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
  return (
    <div className="sidebar-container">
      <h1>Manage Dates</h1>
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
        <hr />
        <div className="dates-control">
          <h1>Dates</h1>
          <div className="keys-list">
            {keys.map((key, ind) => {
              return (
                <Chip
                  key={key}
                  size="small"
                  // icon={<ArrowDownward />}
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
      </FormControl>
      <h4 id="credits">
        Project was made by Sagi Levi |{" "}
        <a href="mailto:lesagi@gmail.com">lesagi@gmail.com</a> |{" "}
        <a href="https://github.com/lesagi">https://github.com/lesagi</a>
      </h4>
    </div>
  );
};

export default Sidebar;

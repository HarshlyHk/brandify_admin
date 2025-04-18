import React, { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosInstance";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
} from "date-fns";
import {
  Typography,
  Grid,
  IconButton,
  Box,
  styled,
  Paper,
  useTheme,
} from "@mui/material";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

const StyledDay = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isSelected" &&
    prop !== "isToday" &&
    prop !== "isCurrentMonth" &&
    prop !== "hasTraffic",
})(({ theme, isSelected, isToday, isCurrentMonth, hasTraffic }) => ({
  height: "100px",
  padding: "12px",
  display: "flex",
  width: "140px",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: isSelected
    ? theme.palette.primary.light
    : isToday
    ? "rgba(255, 135, 38, 0.2)"
    : isCurrentMonth
    ? theme.palette.background.paper
    : theme.palette.grey[100],
  color: isCurrentMonth
    ? isSelected
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary
    : theme.palette.text.disabled,
  borderRadius: "10px",
  border: hasTraffic ? isToday ? "2px solid #ff7403" : "2px solid #ff7403" : "none",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
}));

const Traffic = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();

  const fetchTrafficData = async (date = currentDate) => {
    setLoading(true);
    setError("");
    try {
      const year = format(date, "yyyy");
      const month = format(date, "MM");
      const response = await axiosInstance.get("/traffic", {
        params: { month: `${year}-${month}` },
      });
      const dailyTraffic = response.data.traffic.dailyTraffic || {};
      const events = Object.entries(dailyTraffic).map(([day, value]) => ({
        date: new Date(day),
        visits: value,
      }));
      setTrafficData(events);
    } catch (err) {
      setError("Failed to fetch traffic data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficData();
  }, [currentDate]);

  const renderHeader = () => (
    <div className="flex items-center gap-10 justify-between mb-4">
    
      <IconButton onClick={() => setCurrentDate(addDays(currentDate, -30))}>
        <MdNavigateBefore size={24} />
      </IconButton>
      <div className="text-lg font-bold text-center uppercase">
        {format(currentDate, "MMMM yyyy")}
      </div>
      <IconButton onClick={() => setCurrentDate(addDays(currentDate, 30))}>
        <MdNavigateNext size={24} />
      </IconButton>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      days.push(
        <Grid item xs key={i}>
          <Typography align="center" variant="subtitle1" fontWeight="medium">
            {format(addDays(startDate, i), "EEE")}
          </Typography>
        </Grid>
      );
    }
    return (
      <Grid container spacing={16} mb={1}>
        {days}
      </Grid>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const traffic = trafficData.find((t) => isSameDay(t.date, currentDay));
        days.push(
          <Grid item xs={12} sm={1.71} md={1.71} key={day.toString()}>
            <StyledDay
              isSelected={isSameDay(day, selectedDate)}
              isToday={isSameDay(day, new Date())}
              isCurrentMonth={isSameMonth(day, monthStart)}
              hasTraffic={!!traffic}
              onClick={() => setSelectedDate(currentDay)}
            >
              <Typography variant="body1" fontWeight="500">
                {format(day, "d")}
              </Typography>
              {traffic && (
                <div className={`text-[13px] uppercase `}>
                  {traffic.visits} visits
                </div>
              )}
            </StyledDay>
          </Grid>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid container spacing={2} key={day.toString()} mb={2}>
          {days}
        </Grid>
      );
      days = [];
    }
    return rows;
  };

  return (
    <div className="px-6 max-h-screen">
      <div className="text-xl font-bold mb-4 uppercase absolute">Traffic Overview</div>
      <div className="flex flex-col items-center justify-center">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
      {loading && (
        <Typography align="center" color="textSecondary" mt={2}>
          Loading...
        </Typography>
      )}
      {error && (
        <Typography align="center" color="error" mt={2}>
          {error}
        </Typography>
      )}
    </div>
  );
};

export default Traffic;

import { Gantt, Willow } from 'wx-react-gantt';
import 'wx-react-gantt/dist/gantt.css';
import React, { useRef } from 'react';
import { GanttLink, GanttTasksResponse } from '../types';
import styled from 'styled-components';
import { mix } from 'polished';

const Container = styled.div`
  width: 100%;
  height: 100%;

  .wx-gantt {
    .wx-bar {
      height: 30px !important;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .wx-bar.wx-user-1 {
      color: black;
      background-color: #9fb3df !important;
      border: 1px solid #63667a;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#9FB3DF', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-2 {
      color: black;
      background-color: #9ec6f3 !important;
      border: 1px solid #63667a;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#9EC6F3', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-3 {
      color: black;
      background-color: #bddde4 !important;
      border: 1px solid #63667a;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#BDDDE4', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-4 {
      color: black;
      background-color: #fae7f3 !important;
      border: 1px solid #63667a;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#FAE7F3', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-5 {
      color: black;
      background-color: #ffe3a9 !important;
      border: 1px solid #63667a;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50,'#FFE3A9', '#FFFFFF')} !important;
        }
      }
    }
  }

  .wx-gantt .wx-weekend {
    // display: none;
  }

  .wx-gantt .wx-baseline {
    height: 12px !important;
  }
`;

// Optional: define colors per user
const userColors = {
  Alice: '#FFC107', // Amber
  Bob: '#03A9F4', // Light Blue
  Carol: '#8BC34A', // Light Green
  Default: '#E0E0E0', // Grey fallback
};

const GanttChart = () => {
  // assume start and end inclusive of leave
  const taskResponse: GanttTasksResponse = {
    tasks: [
      {
        id: 20,
        text: 'Task 1',
        start: new Date(2024, 5, 11),
        end: new Date(2024, 5, 12),
        duration: 1,
        progress: 20,
        type: 'task',
        lazy: false,
        user: 'Alice',
      },
      {
        id: 47,
        text: '[1] Master project',
        start: new Date(2024, 5, 12),
        end: new Date(2024, 5, 15),
        duration: 4,
        progress: 0,
        parent: 0,
        type: 'summary',
        user: 'Bob',
      },
      {
        id: 22,
        text: 'Task 2',
        start: new Date(2024, 5, 13),
        end: new Date(2024, 5, 15),
        duration: 3,
        progress: 0,
        parent: 47,
        type: 'task',
        user: 'Bob',
      },
      {
        id: 21,
        text: 'Task 3',
        start: new Date(2024, 5, 10),
        end: new Date(2024, 5, 12),
        duration: 3,
        progress: 0,
        type: 'task',
        lazy: false,
        user: 'Carol',
      },
      {
        id: 25,
        text: 'Task 4',
        start: new Date(2024, 5, 10),
        end: new Date(2024, 5, 12),
        duration: 3,
        progress: 0,
        type: 'task',
        lazy: false,
        user: 'Jim',
      },
      {
        id: 28,
        text: 'Task 5',
        start: new Date(2024, 5, 10),
        end: new Date(2024, 5, 18),
        duration: 8,
        type: 'task',
        lazy: false,
        user: 'Tim',
        base_start: new Date(2024, 5, 11),
        base_end: new Date(2024, 5, 13),
        details: 'www.google.com',
      },
    ],
  };

  const leaves = [
    {
      id: 1,
      text: 'Leave',
      start: new Date(2024, 5, 10),
      end: new Date(2024, 5, 11),
      duration: 2,
      progress: 0,
      type: 'holiday',
      user: 'Tim',
      lazy: false,
    },
  ];

  const users = taskResponse.tasks.map((ele) => ele.user);
  const uniqueUsers = users.filter((user, index, arr) => arr.indexOf(user) === index); // Get unique users
  const usersDict = uniqueUsers.reduce((acc, curr, index) => {
    acc[curr] = `wx-user-${index + 1}`; // wx-user-one, wx-user-two, wx-user-three, etc.
    return acc;
  }, {});

  const lengthUnitRef = useRef('day');

  const tasks = taskResponse.tasks.map((ele) => ({ ...ele, type: usersDict[ele.user] }));

  const taskTypes = Object.entries(usersDict).map(([userName, userType]) => ({
    id: userType,
    label: userName,
  }));

  const links: GanttLink[] = [{ id: 1, source: 20, target: 21, type: 'e2e' }];

  function isDayOff(date) {
    const d = date.getDay();
    return d === 0 || d === 6;
  }

  function highlightTime(d, u) {
    if (u === 'day' && isDayOff(d)) return 'wx-weekend';
    return '';
  }

  // Custom style per task based on `user` field
  const taskStyle = (task) => {
    const color = userColors[task.user] || userColors.Default;
    return {
      backgroundColor: color,
    };
  };

  const dayStyle = (a) => {
    const day = a.getDay() === 6 || a.getDay() === 0;
    return day ? 'wx-weekend' : '';
  };

  const complexScales = [
    { unit: 'year', step: 1, format: 'yyyy' },
    { unit: 'month', step: 2, format: 'MMMM yyy' },
    { unit: 'day', step: 1, format: 'd' },
  ];

  return (
    <Willow>
      <Container className="gantt-chart">
        <Gantt
          baselines
          tasks={[...tasks]}
          links={links}
          taskTypes={[...taskTypes]}
          scales={complexScales}
          start={new Date(2024, 5, 9)}
          end={new Date(2024, 8, 31)}
          highlightTime={highlightTime}
          onDoubleClick={(task) => {
            console.log(task);
          }}
        />
      </Container>
    </Willow>
  );
};

export default GanttChart;

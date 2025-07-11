import { Gantt, Willow } from 'wx-react-gantt';
import 'wx-react-gantt/dist/gantt.css';
import React, { useRef } from 'react';
import { APIResponse, GanttLink, GanttTask, GanttTasksResponse } from '../types';
import styled from 'styled-components';
import { mix } from 'polished';
import { useParams } from 'react-router-dom';
import useApiQuery from '@/hooks/useApiQuery';
import { Loader2 } from 'lucide-react';

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
      color: transparent;
      background-color: #9fb3df !important;
      border: 1px solid #63667a;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#9FB3DF', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-2 {
      color: transparent;
      background-color: #9ec6f3 !important;
      border: 1px solid #63667a;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#9EC6F3', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-3 {
      color: transparent;
      background-color: #bddde4 !important;
      border: 1px solid #63667a;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#BDDDE4', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-4 {
      color: transparent;
      background-color: #fae7f3 !important;
      border: 1px solid #63667a;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#FAE7F3', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-5 {
      color: transparent;
      background-color: #ffe3a9 !important;
      border: 1px solid #63667a;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#FFE3A9', '#FFFFFF')} !important;
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

const GanttChart = ({ tasks: taskProp, links }: { tasks: GanttTask[], links: GanttLink[] }) => {

  const users = taskProp.map((ele) => ele.user);
  const uniqueUsers = users.filter((user, index, arr) => arr.indexOf(user) === index); // Get unique users
  const usersDict = uniqueUsers.reduce((acc, curr, index) => {
    acc[curr] = `wx-user-${index + 1}`; // wx-user-one, wx-user-two, wx-user-three, etc.
    return acc;
  }, {});

  const lengthUnitRef = useRef('day');

  const tasks = taskProp.map((ele) => ({ ...ele, type: usersDict[ele.user] }));

  const taskTypes = Object.entries(usersDict).map(([userName, userType]) => ({
    id: userType,
    label: userName,
  }));

  function isDayOff(date) {
    const d = date.getDay();
    return d === 0 || d === 6;
  }

  function highlightTime(d, u) {
    if (u === 'day' && isDayOff(d)) return 'wx-weekend';
    return '';
  }

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

const GanttChartWrapper = () => {
  const { id } = useParams();
  const { data, isLoading } = useApiQuery<APIResponse<GanttTasksResponse>>(`/projects/${id}/gantt-chart/`);

  return !isLoading && data ? (
    <GanttChart tasks={data.data.gantt_chart.tasks?.map((ele) => {
      const date = new Date(ele.start);
      const nextDay = new Date(date); // clone the original
      nextDay.setDate(date.getDate() + ele.duration);
      return {
        ...ele,
        end: new Date(nextDay.toISOString().split('T')[0]),
      }
    })} links={data.data.gantt_chart.links} />
  ) : (
    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
  )
}

export default GanttChartWrapper;

import { Gantt, Willow, defaultEditorShape } from 'wx-react-gantt';
import 'wx-react-gantt/dist/gantt.css';
import React, { useEffect, useRef } from 'react';
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

    .wx-bar.wx-task {
      color: transparent;
      background-color: #8fe968 !important;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#8fe968', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-1 {
      color: transparent;
      background-color: #fe797b !important;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#fe797b', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-2 {
      color: transparent;
      background-color: #36cedc !important;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#36cedc', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-3 {
      color: transparent;
      background-color: #ffea56 !important;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#ffea56', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-4 {
      color: transparent;
      background-color: #FFB750 !important;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#FFB750', '#FFFFFF')} !important;
        }
      }
    }

    .wx-bar.wx-user-5 {
      color: transparent;
      background-color: #ffe3a9 !important;

      .wx-progress-wrapper {
        .wx-progress-percent {
          background-color: ${mix(50, '#FFE3A9', '#FFFFFF')} !important;
        }
      }
    }
  }

  .wx-gantt .wx-weekend {
    display: none;
  }

  .wx-gantt .wx-baseline {
    display: none;
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

  const columns = [
    { id: "text", header: "Task name", flexgrow: 3 },
    {
      id: "start",
      header: "Start date",
      width: 90,
      align: "center",
    },
    {
      id: "action",
      header: "",
      width: 50,
      align: "center",
    },
  ];

  const complexScales = [
    { unit: 'year', step: 1, format: 'yyyy' },
    { unit: 'month', step: 2, format: 'MMMM yyy' },
    { unit: 'day', step: 1, format: 'd' },
  ];

  const apiRef = useRef<any>();

  useEffect(() => {
    if (apiRef.current) {
      const { tasks, links } = apiRef.current?.getState();
      console.log(tasks); //output the state of tasks

      const newLinks = links._data;
      console.log(newLinks);

      const stores = apiRef.current.getStores();
      console.log("DataStore:", stores);
      console.log('tasks value:', stores.data?._values?._tasks);
    }
  }, [apiRef.current]);

  const editorShape = defaultEditorShape.filter((ele) => ele.key !== 'progress').map((ele) => {
    if (ele.key === 'type') {
      return {
        ...ele,
        label: 'Assignee',
      }
    }
    return ele;
  });

  return (
    <Willow>
      <Container className="gantt-chart">
        <Gantt
          // ref={apiRef}
          // init={(api) => (apiRef.current = api)}
          // baselines
          tasks={tasks.map((ele) => ({ ...ele, type: ele.type || 'task' }))}
          links={links}
          taskTypes={[...taskTypes, { id: 'task', label: 'Not Assigned' }]}
          scales={complexScales}
          start={new Date(2024, 5, 29)}
          end={new Date(2024, 10, 31)}
          highlightTime={highlightTime}
          cellWidth={30}
          onDoubleClick={(task) => {
            console.log(task);
          }}
          columns={columns}
          editorShape={editorShape}
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
        text: ele?.text?.trim() || '',
        // end: new Date(nextDay.toISOString().split('T')[0]),
      }
    })} links={data.data.gantt_chart.links} />
  ) : (
    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
  )
}

export default GanttChartWrapper;

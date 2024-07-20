

/**
 
```dataviewjs
const s = require(app.vault.adapter.basePath + "/.scripts/index.cjs");
s.burndown(dv, app, this.container, "2024-07-21")
```

**/
export async function burndown(dv, app, container, targetEndDateString: string) {
  const tasks = await getTasks(dv)
  console.log(tasks)
  const data = burnoutDataFromTasks(tasks, new Date(targetEndDateString))

  renderBurndownChart(
    app,
    container,
    data,
  )
}


function formatDatetoMMDD(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(date);
}




export function burnoutDataFromTasks(tasks: Task[], targetEndDate: Date) {
  const { oldestTask, newestTask } = getStartAndEnd(tasks, targetEndDate)

  const startDate = oldestTask.completion ?? new Date()
  const remainPriod = getPriodDate(startDate, newestTask.completion ?? targetEndDate)
  const planePriod = getPriodDate(startDate, targetEndDate)

  return {
    ramianTasksPerDay: getRemainTasksPerDay(tasks, remainPriod),
    plannedTasksPerDay: getPlandedTasksPerDay(tasks, planePriod),
    labels: remainPriod.map(formatDatetoMMDD),
    tasksAmount: tasks.length,
  };
}
type BurnoutData = ReturnType<typeof burnoutDataFromTasks>

async function getTasks(dv) {
  const queryResult = await dv.tryQuery(
    'TASK WHERE contains(file.path, this.file.path)'
  ) as QueryResult
  const tasks = (queryResult.values).map(t => {
    if (!t.completion) {
      const { completion, ...rest } = t
      return {
        ...rest,
        completion: undefined,
      }
    }
    const { year, month, day } = t.completion.c
    return {
      ...t,
      completion: new Date(`${year}-${month}-${day}`)
    }
  })
  return tasks
}

const dayMilisec = 1000 * 60 * 60 * 24

function getStartAndEnd(tasks: Task[], targetEndDate: Date) {
  const sorted = tasks.sort((a, b) => {
    if (!a.completion) return 0
    if (!b.completion) return 0

    return a.completion.getTime() > b.completion.getTime() ? 1 : -1
  })
  const newestTask = sorted[sorted.length - 1]
  const oldestTask = sorted[0]

  return {
    newestTask,
    oldestTask
  }
}

function getPriodDate(startDate: Date, endDate: Date): Date[] {
  const days: Date[] = []
  const diffDays = Math.floor((endDate.getTime() - startDate.getTime()) / dayMilisec) + 1
  for (let i = 0; i < diffDays; i++) {
    const tmpDate = new Date(startDate)
    tmpDate.setDate(tmpDate.getDate() + i)
    days.push(tmpDate)
  }
  return days
}





function getRemainTasksPerDay(tasks: Task[], days: Date[]): number[] {
  const completedTasks = days.map(day => {
    const completedTasks = tasks.filter(task => {
      if (task.completion === undefined) return false
      return task.completion.getTime() <= day.getTime()
    })
    return completedTasks.length
  })
  const remainTasks = completedTasks.map((i) => tasks.length - i)
  return remainTasks
}

function getPlandedTasksPerDay(tasks: Task[], days: Date[]): number[] {
  const taskPerDay = tasks.length / days.length
  return days.map((_, i) => {
    return Math.round((tasks.length - taskPerDay * (i + 1)) * 100) / 100
  })
}



interface Dataview {
  tryQuery: (query: string) => Promise<QueryResult>
}



function renderBurndownChart(
  app,
  container,
  data: BurnoutData
) {
  const {
    ramianTasksPerDay: remain,
    plannedTasksPerDay: planned,
    labels,
    tasksAmount
  } = data

  const option = {
    width: 700,
    height: 250,
    backgroundColor: 'transparent',
    grid: {
      bottom: -1,
      containLabel: true
    },
    title: {
      text: ''
    },
    toolbox: {
      left: 250,
      feature: {
        saveAsImage: {}
      }
    },
    tooltip: { trigger: 'axis' },
    legend: { left: 70 },
    xAxis: {
      type: 'category',
      name: 'Day',
      axisTick: { length: 0.06 },
      axisLabel: { rotate: 0, interval: 0, textStyle: { fontSize: "11", color: "#fff" }, height: 100 },
      data: ["start", ...labels]
    },
    yAxis: {
      name: "Story points",
      axisLabel: { textStyle: { fontSize: "11", color: "#fff" } }
    },
    series: [
      {
        type: "line",
        color: '#ff598a',
        name: "Planned",
        data: [
          tasksAmount,
          ...planned,
        ]
      },
      {
        type: "line",
        color: '#59ff6d',
        name: "Actual",
        data: [
          tasksAmount,
          ...remain
        ]
      },

    ]

  }
  app.plugins.plugins['obsidian-echarts'].render(
    option,
    container
  )
}

// ```dataviewjs
// const tasks = await	dv.tryQuery('TASK WHERE contains(file.path, this.file.path)')
// console.log(JSON.stringify(tasks, null, 2))
// ```


// type QueryResult = typeof sampleTask;

interface DateTime {
  c: {
    day: number,
    hour: number,
    millisecond: number,
    minute: number,
    month: number,
    second: number,
    year: number,
  }
}

type QueryResult = {
  values: {
    completion?: DateTime,
    completed: boolean
  }[]
}
// type Task = QueryResult['values']

export interface Task {
  completion?: Date,
  completed: boolean

}



export const _test = {
  getPriod: getStartAndEnd,
  getPriodDate,
  getRemainTasksPerDay,
  getPlandedTasksPerDay,
}

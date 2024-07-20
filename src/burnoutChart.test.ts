import { expect, test, describe } from "bun:test";
import { _test, burnoutDataFromTasks, Task } from "./burnoutChart";

const date = (date: string): Date => new Date(date)

const task = (dateString?: string): Task => {
  const completion = dateString ? date(dateString) : undefined

  return {
    completed: true,
    completion,
  }

}

describe("4 tasks", () => {
  test("burnoutDataFromTasks", () => {
    const tasks = [
      task("2023-01-01"),
      task("2023-01-02"),
      task("2023-01-03"),
      task("2023-01-04"),
    ]

    const res = burnoutDataFromTasks(tasks, date("2023-01-04"))
    expect(res).toEqual(
      {
        "ramainTasksPerDay": [3, 2, 1, 0],
        "labels": [
          "Jan 01",
          "Jan 02",
          "Jan 03",
          "Jan 04",
        ],
        "plannedTasksPerDay": [3, 2, 1, 0],
        tasksAmount: 4,
      }
    )
  });
  test("burnoutDataFromTasks - 1 task", () => {
    const tasks = [
      "2023-01-01",
    ].map((data) => task(data))

    const res = burnoutDataFromTasks(tasks, date("2023-01-04"))
    expect(res).toEqual(
      {
        "ramainTasksPerDay": [0],
        "labels": [
          "Jan 01",
        ],
        "plannedTasksPerDay": [0],
        tasksAmount: 1,
      }
    )
  });
  test("burnoutDataFromTasks - 2 task", () => {
    const tasks = [
      "2023-01-01",
      "2023-01-02",
    ].map((data) => task(data))

    const res = burnoutDataFromTasks(tasks, date("2023-01-04"))
    expect(res).toEqual(
      {
        ramainTasksPerDay: [1, 0],
        labels: [
          "Jan 01",
          "Jan 02",
        ],
        plannedTasksPerDay: [1, 0],
        tasksAmount: 2,
      }
    )
  });

  test("getPriod", () => {
    const oldestTask = task("2023-01-01")
    const newestTask = task("2023-01-04")
    const res = _test.getPriod([
      oldestTask,
      task("2023-01-02"),
      newestTask,
    ], date("2023-01-04"))

    expect(res).toEqual([
      date("2023-01-01"),
      date("2023-01-02"),
      date("2023-01-03"),
      date("2023-01-04")
    ])
  })
  test("getPriod - 2 ", () => {
    const oldestTask = task("2023-01-01")
    const newestTask = task("2023-01-04")
    const res = _test.getPriod([
      oldestTask,
      task(),
      task(),
      task(),
      task(),
    ], date("2023-01-02"))

    expect(res).toEqual([
      date("2023-01-01"),
      date("2023-01-02"),
    ])
  })

  test("getPriodDate - 4 day", () => {
    const res = _test.getPriodDate(
      date("2023-01-01"),
      date("2023-01-04"),
    )
    expect(res).toEqual([
      date("2023-01-01"),
      date("2023-01-02"),
      date("2023-01-03"),
      date("2023-01-04"),
    ])
  })
  test("getPriodDate - 1 day", () => {
    const res = _test.getPriodDate(
      date("2023-01-01"),
      date("2023-01-01"),
    )
    expect(res).toEqual([
      date("2023-01-01"),
    ])
  })

  test("getRemainTasksPerDay", () => {
    const res = _test.getRemainTasksPerDay(
      [
        task("2023-01-01"),
        task("2023-01-02"),
        task("2023-01-03"),
      ],
      [
        date("2023-01-01"),
        date("2023-01-02"),
        date("2023-01-03"),
      ]
    )
    expect(res).toEqual([2, 1, 0])
  })

  test("getRemainTasksPerDay - 3 task", () => {
    const res = _test.getRemainTasksPerDay(
      [
        task("2023-01-01"),
        task(),
        task("2023-01-03"),
      ],
      [
        date("2023-01-01"),
        date("2023-01-02"),
        date("2023-01-03"),
      ]
    )
    expect(res).toEqual([2, 2, 1])
  })

  test("getRemainTasksPerDay - 4 task", () => {
    const res = _test.getRemainTasksPerDay(
      [
        task("2023-01-02"),
        task(),
        task(),
        task("2023-01-03"),
      ],
      [
        date("2023-01-01"),
        date("2023-01-02"),
        date("2023-01-03"),
        date("2023-01-04"),
      ]
    )
    expect(res).toEqual([4, 3, 2, 2])
  })
  test("getRemainTasksPerDay - 4 task", () => {
    const res = _test.getRemainTasksPerDay(
      [
        task("2023-01-01"),
        task("2023-01-02"),
        task("2023-01-03"),
        task("2023-01-04"),
      ],
      [
        date("2023-01-01"),
        date("2023-01-02"),
        date("2023-01-03"),
        date("2023-01-04"),
      ]
    )
    expect(res).toEqual([3, 2, 1, 0])
  })
  test("getRemainTasksPerDay - 8 task", () => {
    const res = _test.getRemainTasksPerDay(
      [
        task("2023-01-01"),
        task("2023-01-02"),
        task("2023-01-03"),
        task(),
        task(),
        task(),
        task(),
        task(),
      ],
      [
        date("2023-01-01"),
        date("2023-01-02"),
        date("2023-01-03"),
        date("2023-01-04"),
      ]
    )
    expect(res).toEqual([7, 6, 5, 5])
  })


  test("getPlandedTasksPerDay", () => {
    const res = _test.getPlandedTasksPerDay([
      task("2023-01-02"),
      task(),
      task("2023-01-03"),
    ],
      [
        date("2023-01-01"),
        date("2023-01-02"),
        date("2023-01-03"),
      ]
    )
    expect(res).toEqual([2, 1, 0])
  })

})

import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Task } from 'src/app/model/Task';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    /*const task = [
      {
        id: 1,
        name: 'Task 1',
        priority: 30,
        parentTask: 'Task 2',
        isCompleted: false,
        startDate: moment("12-01-2019").format("MM/DD/YYYY"),
        endDate: moment("06-16-2019").format("MM/DD/YYYY")
      },
      {
        id: 2,
        name: 'Task 2',
        priority: 18,
        parentTask: 'Task 4',
        isCompleted: false,
        startDate: moment("03-03-2017").format("MM/DD/YYYY"),
        endDate: moment("12-29-2020").format("MM/DD/YYYY")
      },
      {
        id: 3,
        name: 'Task 3',
        priority: 15,
        parentTask: null,
        isCompleted: false,
        startDate: moment("01-01-2006").format("MM/DD/YYYY"),
        endDate: moment("12-01-2007").format("MM/DD/YYYY")
      }
    ];

    return {task};*/
    return null;
  }

  genId(tasks: Task[]): number {
    //return tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    return 0;
  }

  constructor() { }
}

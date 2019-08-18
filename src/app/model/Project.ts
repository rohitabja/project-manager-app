import { Moment } from 'moment';
import { User } from 'src/app/model/User';
import { Task } from 'src/app/model/Task';

export class Project {

    projectId: number;
    projectName: string;
    dateChecked?: boolean;
    startDate?: Moment;
    endDate?: Moment;
    priority?: number;
    manager: User;
    tasks?: Task[];
    noOfTasksCompleted?: number;
}
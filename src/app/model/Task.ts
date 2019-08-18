import { Moment } from 'moment';
import { ParentTask } from 'src/app/model/ParentTask';
import { User } from 'src/app/model/User';
import { Project } from 'src/app/model/Project';

export class Task {

    taskId: number;
    taskName: string;
    startDate?: Moment;
    endDate?: Moment;
    priority?: number;
    completed?: boolean;
    parentTask?: ParentTask;
    user: User;
    project: Project;
    parent: boolean;
    
}   
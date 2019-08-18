import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/model/User';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(data: any[], searchText: string, type: string): any {
    if (!data) return [];
    if (!searchText) return data;

    searchText = searchText.toLowerCase();

    switch(type) {
      case 'user': return this._filterUser(searchText, data);
      case 'project': return this._filterProject(searchText, data);
      default: return data;
    }
  }

  private _filterUser(searchText: string, data: any): any {
    return data.filter(user => this.filterUser(searchText, user));
  }

  private _filterProject(searchText: string, data: any): any {
    return data.filter(project => project.projectName.toLowerCase().includes(searchText));
  }

  private filterUser(filterValue: string, user: User): boolean {
    return user.employeeId.toString().includes(filterValue)
      || user.firstName.toLowerCase().includes(filterValue)
      || user.lastName.toLowerCase().includes(filterValue);
  }

}

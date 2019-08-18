import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(data: any[], field?: any): any {
    if (!data) return [];
    if (!field) return data;
    if (data.length === 1) return data;

    return this.sortBy(field, data);
  }

  private sortBy(field: string, data: any): any {
    data.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });

    return data;
  }

}

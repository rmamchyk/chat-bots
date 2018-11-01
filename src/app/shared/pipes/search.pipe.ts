import { Pipe, PipeTransform } from '@angular/core';

import { User } from '../models/User';

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {

  transform(users: User[], searchInput: string): User[] {
    if (!users || users.length === 0 || searchInput.length === 0) {
      return users;
    }
    const nameRegex = new RegExp("^" + searchInput.toLowerCase(), "i")
    const resultArray = [];
    for (let user of users) {
      if (user.username.search(nameRegex)>-1) {
        resultArray.push(user);
      }
    }
    return resultArray;
  }

}

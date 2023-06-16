import {Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {CaUser, CaUserDatasourcePaginated} from '../../../../model/entities/ca-user.class';
import {FlTableColumnStatic, FlViewContext} from '@monorepo/front-core-lib';

/**
 * Table to display users
 * It supports a template content in column
 */
@Component({
  selector: 'ca-user-table',
  templateUrl: './ca-user-table.component.html',
  styleUrls: ['./ca-user-table.component.scss']
})
export class CaUserTableComponent {

  @Input() datasource: CaUserDatasourcePaginated;

  @Input() columns: FlTableColumnStatic<CaUser>[] = ['fullname', 'email', 'phone', 'category', 'lastLogin', 'createdAt', 'adminActions'];

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;


  getUserViewContext(user: CaUser): FlViewContext<CaUser> {
    return {$implicit: user};
  }

}

import { Observable } from 'rxjs';
import { HaUser } from '../../../ha-model/ha-entities/ha-user';
import { HaCoAuthorInvite } from './ha-co-author-invite.class';

export interface HaCoAuthorService {
  getCoAuthors(id: string): Observable<HaUser[]>;

  getCoAuthorsPendingInvites(id: string): Observable<HaCoAuthorInvite[]>;

  removeCoAuthor(id: string, coAuthorId: string): Observable<any>;

  deleteCoAuthorInvite(inviteId: string): Observable<void>;

  inviteCoAuthor(id: string, coAuthorMail: string): Observable<boolean>;

  isCoAuthorInviteValid(token: string): Observable<HaCoAuthorInvite>;

  acceptInvite(token: string): Observable<any>;
}

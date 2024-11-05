import { Injectable, OnDestroy } from '@angular/core';
import { LabNoteService } from '../../../lab-core/entity-service/lab-note.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { LabNote, LabNoteContent } from '../../../lab-core/model/entities/lab-note.entity';
import { filter } from 'rxjs/operators';

@Injectable()
export class LabNoteDetailPageState implements OnDestroy {
  private note$: BehaviorSubject<LabNote> = new BehaviorSubject(null);
  private noteContent$: BehaviorSubject<LabNoteContent> = new BehaviorSubject(null);

  constructor(private noteService: LabNoteService) {}

  public init(noteId: string): void {
    this.noteService.getNote(noteId).subscribe({
      next: (note) => this.note$.next(note),
      error: (error) => this.note$.error(error),
    });

    this.noteService.getNoteContent(noteId).subscribe({
      next: (content) => this.noteContent$.next(content),
      error: (error) => this.noteContent$.error(error),
    });
  }

  public get currentNote(): LabNote {
    return this.note$.value;
  }

  public getNote$(): Observable<LabNote> {
    return this.note$.asObservable().pipe(filter((note) => note != null));
  }

  public getContent$(): Observable<LabNoteContent> {
    return this.noteContent$.asObservable().pipe(filter((note) => note != null));
  }

  public updateNote(note: LabNote): void {
    const currentNote = this.currentNote;
    currentNote.title = note.title;
    currentNote.folder = note.folder;
    currentNote.isValidated = note.isValidated;
    currentNote.isArchived = note.isArchived;
    this.note$.next(currentNote);
  }

  public refreshNote(): void {
    this.noteService.getNote(this.currentNote.id).subscribe({
      next: (note) => this.note$.next(note),
      error: (error) => this.note$.error(error),
    });
  }

  public updateContent(content: LabNoteContent): void {
    this.noteContent$.next(content);
  }

  ngOnDestroy(): void {
    this.note$.complete();
    this.noteContent$.complete();
  }
}

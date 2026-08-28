import { inject, Injectable, OnDestroy } from '@angular/core';
import { LiNote, LiNoteService } from '@monorepo/lab-lib/li-core';
import { TeRichText } from '@monorepo/text-editor';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class LabNoteDetailPageState implements OnDestroy {
  private noteService = inject(LiNoteService);

  private note$: BehaviorSubject<LiNote | null> = new BehaviorSubject<LiNote | null>(null);
  private noteContent$: BehaviorSubject<TeRichText | null> = new BehaviorSubject<TeRichText | null>(null);

  public init(noteId: string): void {
    this.noteService.getNote(noteId).subscribe({
      next: (note) => this.note$.next(note),
      error: (error) => this.note$.error(error),
    });

    this.noteService.getNoteContent(noteId).subscribe({
      next: (content) => this.noteContent$.next(new TeRichText(content)),
      error: (error) => this.noteContent$.error(error),
    });
  }

  public get currentNote(): LiNote {
    const note = this.note$.value;
    if (note == null) {
      throw new Error('Note not loaded');
    }
    return note;
  }

  public getNote$(): Observable<LiNote> {
    return this.note$.asObservable().pipe(filter((note): note is LiNote => note != null));
  }

  public getContent$(): Observable<TeRichText> {
    return this.noteContent$.asObservable().pipe(filter((note): note is TeRichText => note != null));
  }

  public updateNote(note: LiNote): void {
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

  public updateContent(richText: TeRichText): void {
    this.noteContent$.next(richText);
  }

  ngOnDestroy(): void {
    this.note$.complete();
    this.noteContent$.complete();
  }
}

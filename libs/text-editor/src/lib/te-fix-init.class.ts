
export class TeFixInit {

  public static fixEditorInit(): void{
    // use to fix the error Unable to preventDefault inside passive event listener invocation.
    // we create a custom event listener call before all others with passive false so the
    // text editor is using this listener and not another one with passive true
    // this is a dirty fix
    // This must be called in main file to be executed before all other event listeners
    // because now TeTextEditorModule is not loaded directly

    // this hides the error "Unable to preventDefault inside passive event listener invocation."
    // When changing a paragraph to header for example
    document.addEventListener('keydown', () => {}, {
      passive: false,
      capture: true,
    });
  }
}

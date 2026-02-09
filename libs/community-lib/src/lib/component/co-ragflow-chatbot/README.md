# CoRagflow Chatbot Component

## Architecture

Le composant chatbot Ragflow utilise une architecture basée sur les **signals Angular** et un **state injecté au niveau du composant** pour une meilleure isolation et performance.

### CoRagflowChatbotState

Le state (`CoRagflowChatbotState`) est injecté au niveau du composant via le provider, ce qui garantit :

- **Isolation** : Chaque instance du chatbot a son propre state
- **Nettoyage automatique** : Le state est détruit avec le composant
- **Performance** : Utilisation des signals pour une détection de changements optimisée
- **Testabilité** : Facile à tester avec des mocks

### Signals disponibles

Le state expose les signals suivants :

```typescript
// Signals d'état brut
connectionState: Signal<CoRagflowConnectionState>;
messages: Signal<CoRagflowMessage[]>;
isTyping: Signal<boolean>;
streamingContent: Signal<string>;
conversationId: Signal<string | null>;

// Computed signals
isConnected: Signal<boolean>;
isConnecting: Signal<boolean>;
hasError: Signal<boolean>;
displayMessages: Signal<CoRagflowMessage[]>;
```

### Utilisation

Le composant expose directement les signals du state :

```typescript
@Component({
  selector: 'co-ragflow-chatbot',
  providers: [CoRagflowChatbotState], // State injecté au niveau du composant
  // ...
})
export class CoRagflowChatbotComponent {
  private state = inject(CoRagflowChatbotState);

  // Expose les signals
  readonly isConnected = this.state.isConnected;
  readonly displayMessages = this.state.displayMessages;
  // ...
}
```

### Migration depuis CoRagflowChatbotService

⚠️ **Le service global `CoRagflowChatbotService` est déprécié.**

Si vous utilisez encore ce service, migrez vers `CoRagflowChatbotState` :

**Avant (service global) :**

```typescript
@Component({
  // ...
})
export class MyComponent {
  private chatbotService = inject(CoRagflowChatbotService);
}
```

**Après (state local) :**

```typescript
@Component({
  providers: [CoRagflowChatbotState],
  // ...
})
export class MyComponent {
  private state = inject(CoRagflowChatbotState);
}
```

### Avantages de cette architecture

1. **Isolation** : Chaque composant a son propre state, pas d'effets de bord entre instances
2. **Performance** : Les signals optimisent la détection de changements
3. **Simplicité** : Plus besoin de gérer manuellement les souscriptions
4. **Nettoyage automatique** : Le state est détruit automatiquement avec le composant
5. **Testabilité** : Facile à tester en mockant le state au niveau du provider

## Composants

### CoRagflowChatbotComponent

Composant principal du chatbot.

**Inputs :**

- `chatId` (required) : ID de l'agent Ragflow
- `userId` (optional) : ID de l'utilisateur pour l'authentification
- `conversationId` (optional) : ID de conversation à reprendre
- `placeholder` (optional) : Texte du placeholder

### CoRagflowChatbotBubbleComponent

Bouton flottant qui ouvre le chatbot dans un portal.

**Inputs :**

- Mêmes inputs que `CoRagflowChatbotComponent`

### CoRagflowChatbotPanelComponent

Panel du chatbot utilisé par le bubble component.

## WebSocket Events

Le state gère automatiquement les événements WebSocket suivants :

- `connect` : Connexion établie
- `disconnect` : Déconnexion
- `connect_error` : Erreur de connexion
- `conversation_joined` : Conversation rejointe
- `typing_start` : Bot en train d'écrire
- `typing_end` : Bot a fini d'écrire
- `message_chunk` : Chunk de message (streaming)
- `message_complete` : Message complet reçu
- `message_error` : Erreur lors de l'envoi du message

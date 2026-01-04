# Native Dialog Element Usage Guide

This project uses the native HTML `<dialog>` element for all modal dialogs, providing better accessibility, native browser features, and cleaner code.

## Features

### Native Dialog Benefits

1. **Built-in Accessibility**: Native dialog element provides proper ARIA attributes and keyboard navigation
2. **Backdrop Support**: Native `::backdrop` pseudo-element for styling the overlay
3. **Form Integration**: Native form submission with `method="dialog"` attribute
4. **ESC Key Support**: Automatically closes dialog on ESC key press
5. **Focus Management**: Browser automatically manages focus when dialog opens/closes

## Usage

### Basic Dialog Structure

```html
<dialog #dialog class="dialog">
  <div class="dialog-container">
    <div class="dialog-header">
      <h2>Dialog Title</h2>
      <form method="dialog">
        <button type="submit" value="cancel">×</button>
      </form>
    </div>
    <div class="dialog-body">
      <!-- Content here -->
    </div>
    <div class="dialog-footer">
      <form method="dialog">
        <button type="submit" value="cancel">Cancel</button>
      </form>
      <button type="button" (click)="onConfirm()">Confirm</button>
    </div>
  </div>
</dialog>
```

### Opening a Dialog

```typescript
@ViewChild('dialog', { static: false }) dialogRef!: ElementRef<HTMLDialogElement>;

show(): void {
  if (this.dialogRef?.nativeElement) {
    this.dialogRef.nativeElement.showModal();
  }
}
```

### Closing a Dialog

```typescript
close(): void {
  if (this.dialogRef?.nativeElement) {
    this.dialogRef.nativeElement.close();
  }
}
```

### Using Form Method

The `method="dialog"` attribute on a form inside a dialog allows the form to close the dialog when submitted:

```html
<form method="dialog">
  <button type="submit" value="cancel">Cancel</button>
  <button type="submit" value="confirm">Confirm</button>
</form>
```

The dialog's `returnValue` will be set to the button's value.

## Styling

### Dialog Styling

```scss
.dialog {
  padding: 0;
  border: none;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  background: transparent;
  
  &::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  &[open] {
    animation: dialog-show 0.2s ease-out;
  }
}
```

### Animations

The dialog includes smooth animations for opening:

```scss
@keyframes dialog-show {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

## Best Practices

### ✅ DO

- Use `showModal()` for modal dialogs (blocks interaction with page)
- Use `show()` for non-modal dialogs (allows interaction with page)
- Handle the `close` event to clean up state
- Use `method="dialog"` on forms inside dialogs
- Provide proper labels and ARIA attributes
- Handle ESC key cancellation properly

### ❌ DON'T

- Don't manually create overlay divs (use `::backdrop`)
- Don't use `position: fixed` for dialog positioning
- Don't forget to close dialogs when actions complete
- Don't block the main thread when opening dialogs
- Don't nest dialogs without proper management

## Components Using Dialog

1. **ConfirmationDialogComponent**: For delete/create/update confirmations
2. **UserFormComponent**: For creating and editing users

## HTMX Integration

When using HTMX with dialogs, ensure that:

1. HTMX swaps content into dialog containers
2. Dialogs are opened after HTMX swaps complete
3. Dialog close events trigger HTMX refresh if needed

```typescript
// After HTMX swap
htmx.on('htmx:afterSwap', (event) => {
  const dialog = event.detail.target.querySelector('dialog');
  if (dialog) {
    dialog.showModal();
  }
});
```

## Browser Support

The native `<dialog>` element is supported in:
- Chrome 37+
- Edge 79+
- Firefox 98+
- Safari 15.4+
- Opera 24+

For older browsers, consider using a polyfill or fallback implementation.


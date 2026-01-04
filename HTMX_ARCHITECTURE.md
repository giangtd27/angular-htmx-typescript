# HTMX Architecture Guide

This project uses **HTMX-first architecture** with Angular and TypeScript. All views and interactions should use HTMX attributes for dynamic content updates.

## Core Principles

1. **HTMX for Views**: All view rendering and updates use HTMX attributes (`hx-get`, `hx-post`, `hx-put`, `hx-delete`)
2. **Angular for Logic**: TypeScript/Angular handles business logic, state management, and services
3. **HTML Fragments**: Backend returns HTML fragments that HTMX swaps into the DOM
4. **Progressive Enhancement**: Start with HTML, enhance with HTMX, add Angular for complex logic

## Architecture Layers

### 1. HTMX Layer (View Updates)
- Uses HTMX attributes for all dynamic content
- Handles form submissions, button clicks, and content swaps
- No JavaScript needed for basic interactions

### 2. Angular Layer (Business Logic)
- Services for API calls and business logic
- Components for complex UI logic
- State management with signals
- Authentication and authorization

### 3. Backend Layer (HTML Fragments)
- Returns HTML fragments instead of JSON
- Handles HTMX-specific headers
- Provides partial views for swaps

## HTMX Attributes Usage

### Basic HTMX Attributes

```html
<!-- GET request -->
<button 
  hx-get="/api/users/form"
  hx-target="#dialog-container"
  hx-swap="innerHTML">
  Add User
</button>

<!-- POST form -->
<form 
  hx-post="/api/users/create"
  hx-target="#users-list"
  hx-swap="innerHTML">
  <!-- form fields -->
</form>

<!-- DELETE with confirmation -->
<button 
  hx-delete="/api/users/123"
  hx-target="#users-list"
  hx-swap="innerHTML"
  hx-confirm="Are you sure?">
  Delete
</button>
```

### Common HTMX Patterns

#### 1. Loading Indicators
```html
<div hx-get="/api/users/list" hx-indicator=".loading">
  <div class="loading" style="display: none;">Loading...</div>
</div>
```

#### 2. Event Triggers
```html
<!-- Trigger on load -->
<div hx-get="/api/users/list" hx-trigger="load"></div>

<!-- Trigger on custom event -->
<div hx-get="/api/users/list" hx-trigger="refreshUsers from:body"></div>

<!-- Multiple triggers -->
<div hx-get="/api/users/list" hx-trigger="load, refreshUsers from:body, every 30s"></div>
```

#### 3. Swap Strategies
```html
<!-- innerHTML (default) -->
<div hx-swap="innerHTML"></div>

<!-- outerHTML -->
<div hx-swap="outerHTML"></div>

<!-- beforebegin, afterbegin, beforeend, afterend -->
<div hx-swap="afterend"></div>
```

#### 4. Targeting
```html
<!-- Target specific element -->
<div hx-target="#users-list"></div>

<!-- Target closest parent -->
<div hx-target="closest .container"></div>

<!-- Target next sibling -->
<div hx-target="next .content"></div>
```

## Component Structure

### HTMX-Enabled Component Template

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './example.component.html'
})
export class ExampleComponent implements OnInit, AfterViewInit {
  constructor(private htmxService: HtmxService) {}

  ngOnInit(): void {
    // Initialize component state
  }

  ngAfterViewInit(): void {
    // Ensure HTMX is initialized
    this.htmxService.init();
    
    // Set up HTMX event listeners
    this.setupHtmxEvents();
  }

  private setupHtmxEvents(): void {
    // Listen for HTMX events
    document.body.addEventListener('htmx:afterSwap', (event: any) => {
      // Handle swap completion
    });
  }
}
```

### HTMX Template Example

```html
<div class="container">
  <!-- HTMX will load content here -->
  <div 
    id="content-area"
    hx-get="/api/content"
    hx-trigger="load, refreshContent from:body"
    hx-swap="innerHTML">
    <!-- Initial content or loading state -->
  </div>

  <!-- Action buttons with HTMX -->
  <button 
    hx-get="/api/form"
    hx-target="#dialog-container"
    hx-swap="innerHTML">
    Open Form
  </button>
</div>

<!-- Dialog container for modals -->
<div id="dialog-container"></div>
```

## Service Integration

### HTMX Service Methods

```typescript
// Initialize HTMX
htmxService.init();

// Trigger custom event
htmxService.triggerEvent('refreshUsers');

// Programmatic swap
htmxService.swapContent('#target', '/api/content', 'GET');

// Check availability
if (htmxService.isAvailable()) {
  // Use HTMX
}
```

## Best Practices

### ✅ DO

1. **Use HTMX attributes for all view updates**
   ```html
   <button hx-get="/api/users" hx-target="#list">Load Users</button>
   ```

2. **Return HTML fragments from backend**
   ```typescript
   // Backend should return HTML, not JSON
   return this.render('users/list.html', { users });
   ```

3. **Use HTMX events for coordination**
   ```typescript
   document.body.addEventListener('htmx:afterSwap', (event) => {
     // Handle swap completion
   });
   ```

4. **Combine HTMX with Angular services**
   ```typescript
   // Use Angular service for business logic
   this.userService.getAllUsers().subscribe(users => {
     // Process data, then let HTMX handle display
   });
   ```

5. **Use native dialog elements with HTMX**
   ```html
   <dialog>
     <form hx-post="/api/users" hx-target="#users-list">
       <!-- form content -->
     </form>
   </dialog>
   ```

### ❌ DON'T

1. **Don't mix HTMX with Angular event handlers unnecessarily**
   ```html
   <!-- Bad -->
   <button (click)="loadData()" hx-get="/api/data">Load</button>
   
   <!-- Good -->
   <button hx-get="/api/data" hx-target="#content">Load</button>
   ```

2. **Don't return JSON when HTMX expects HTML**
   ```typescript
   // Bad
   return { users: [...] };
   
   // Good
   return this.render('users/list.html', { users });
   ```

3. **Don't use Angular HttpClient for HTMX requests**
   ```typescript
   // Bad - bypasses HTMX
   this.http.get('/api/users').subscribe(...);
   
   // Good - let HTMX handle it
   // Use hx-get attribute in template
   ```

4. **Don't manually manipulate DOM after HTMX swaps**
   ```typescript
   // Bad
   htmx.ajax('GET', '/api/users', {
     target: '#list',
     swap: 'innerHTML'
   });
   document.getElementById('list').classList.add('loaded'); // Wrong!
   
   // Good - use HTMX events
   document.body.addEventListener('htmx:afterSwap', (event) => {
     if (event.detail.target.id === 'list') {
       event.detail.target.classList.add('loaded');
     }
   });
   ```

## HTMX Events

### Available Events

- `htmx:configRequest` - Before request is made
- `htmx:beforeRequest` - Request is about to be made
- `htmx:afterRequest` - Request completed
- `htmx:responseError` - Request failed
- `htmx:beforeSwap` - Before content swap
- `htmx:afterSwap` - After content swap
- `htmx:afterSettle` - After all swaps and settles

### Event Usage

```typescript
document.body.addEventListener('htmx:afterSwap', (event: any) => {
  const target = event.detail.target;
  const xhr = event.detail.xhr;
  
  // Handle successful swap
  if (xhr.status === 200) {
    // Update UI, show notifications, etc.
  }
});
```

## File Structure

```
src/app/
├── components/          # Angular components (HTMX-enabled)
│   ├── users/
│   │   ├── users.component.ts
│   │   ├── users.component.html  # Uses HTMX attributes
│   │   └── users.component.scss
├── services/           # Business logic services
│   ├── htmx.service.ts # HTMX integration
│   ├── user.service.ts
│   └── auth.service.ts
├── views/              # HTML fragment templates (if using server-side)
│   ├── users-list.view.html
│   └── user-form.view.html
└── models/             # TypeScript models
    └── user.model.ts
```

## Creating New Features

When creating new features:

1. **Start with HTML structure** - Design the static HTML first
2. **Add HTMX attributes** - Make it dynamic with HTMX
3. **Add Angular logic** - Use TypeScript for complex logic
4. **Use services** - Keep business logic in services
5. **Return HTML fragments** - Backend returns HTML, not JSON

### Example: Creating a New CRUD Feature

```html
<!-- 1. HTML Structure -->
<div id="items-list">
  <!-- Items will be loaded here -->
</div>

<!-- 2. Add HTMX -->
<div 
  id="items-list"
  hx-get="/api/items"
  hx-trigger="load, refreshItems from:body"
  hx-swap="innerHTML">
</div>

<!-- 3. Add actions -->
<button 
  hx-get="/api/items/form"
  hx-target="#dialog-container"
  hx-swap="innerHTML">
  Add Item
</button>
```

## Migration Checklist

When converting existing Angular components to HTMX:

- [ ] Replace `(click)` handlers with `hx-get`/`hx-post` attributes
- [ ] Replace `*ngIf` loading states with `hx-indicator`
- [ ] Replace `*ngFor` with server-rendered HTML fragments
- [ ] Move form submissions to HTMX (`hx-post` on forms)
- [ ] Use HTMX events instead of Angular lifecycle hooks for swaps
- [ ] Update backend to return HTML fragments
- [ ] Test all interactions work with HTMX

## Resources

- [HTMX Documentation](https://htmx.org/docs/)
- [HTMX Attributes Reference](https://htmx.org/reference/)
- [HTMX Events](https://htmx.org/reference/#events)


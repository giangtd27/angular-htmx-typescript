import { Injectable, Injector } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

declare global {
  interface Window {
    htmx: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class HtmxService {
  private initialized = false

  constructor(
    private http: HttpClient,
    private injector: Injector
  ) {}

  /**
   * Initialize HTMX with Angular integration
   * This should be called once when the app starts
   */
  init(): void {
    if (this.initialized || typeof window === 'undefined' || !window.htmx) {
      return
    }

    this.initialized = true

    // Configure HTMX
    window.htmx.config.globalViewTransitions = true
    window.htmx.config.useTemplateFragments = true
    window.htmx.config.defaultSwapStyle = 'innerHTML'
    window.htmx.config.defaultSwapDelay = 0
    
    // Add authentication token to all HTMX requests
    document.body.addEventListener('htmx:configRequest', (event: any) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        event.detail.headers['Authorization'] = `Bearer ${token}`
      }
      event.detail.headers['X-Requested-With'] = 'XMLHttpRequest'
      event.detail.headers['HX-Request'] = 'true'
    })

    // Handle HTMX responses and errors
    document.body.addEventListener('htmx:responseError', (event: any) => {
      console.error('HTMX Error:', event.detail)
      // Handle errors (show toast, etc.)
    })

    // Handle successful swaps
    document.body.addEventListener('htmx:afterSwap', (event: any) => {
      const target = event.detail.target
      
      // Re-initialize any Angular components in swapped content
      this.reinitializeAngularComponents(target)
      
      // Open dialogs if they exist in swapped content
      const dialog = target.querySelector('dialog')
      if (dialog) {
        (dialog as HTMLDialogElement).showModal()
      }
    })

    // Handle form submissions
    document.body.addEventListener('htmx:afterRequest', (event: any) => {
      // Close dialog on successful form submission
      if (event.detail.successful && event.detail.pathInfo.requestPath.includes('/api/users')) {
        const dialog = document.querySelector('#dialog-container dialog')
        if (dialog) {
          (dialog as HTMLDialogElement).close()
        }
      }
    })
  }

  /**
   * Get HTMX instance
   */
  getHtmx(): any {
    return typeof window !== 'undefined' ? window.htmx : null
  }

  /**
   * Process HTMX request and return HTML fragment
   * Use this for programmatic HTMX requests
   */
  processRequest(url: string, method: string = 'GET', data?: any): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'HX-Request': 'true'
    })

    const token = localStorage.getItem('auth_token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const options = { headers }

    switch (method.toUpperCase()) {
      case 'GET':
        return this.http.get(url, { ...options, responseType: 'text' })
      case 'POST':
        return this.http.post(url, data, { ...options, responseType: 'text' })
      case 'PUT':
        return this.http.put(url, data, { ...options, responseType: 'text' })
      case 'DELETE':
        return this.http.delete(url, { ...options, responseType: 'text' })
      default:
        return this.http.get(url, { ...options, responseType: 'text' })
    }
  }

  /**
   * Swap content using HTMX programmatically
   */
  swapContent(target: string, url: string, method: string = 'GET', data?: any): void {
    const htmx = this.getHtmx()
    if (htmx) {
      htmx.ajax(method, url, {
        target: target,
        swap: 'innerHTML',
        values: data
      })
    }
  }

  /**
   * Trigger HTMX event
   */
  triggerEvent(eventName: string, detail?: any): void {
    const htmx = this.getHtmx()
    if (htmx) {
      htmx.trigger(document.body, eventName, detail)
    }
  }

  /**
   * Re-initialize Angular components in swapped content
   */
  private reinitializeAngularComponents(element: HTMLElement): void {
    // Find any Angular components that need re-initialization
    const angularElements = element.querySelectorAll('[ng-component], [data-angular-component]')
    angularElements.forEach(el => {
      // Components will be automatically initialized by Angular
      // This is a placeholder for any custom initialization needed
    })
  }

  /**
   * Check if HTMX is available
   */
  isAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.htmx
  }
}

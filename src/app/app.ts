import { Component, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { HtmxService } from './services/htmx.service'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  constructor(private htmxService: HtmxService) {}

  ngOnInit(): void {
    // Initialize HTMX when app starts
    this.htmxService.init()
  }
}

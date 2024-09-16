import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '@environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private subscription?: Subscription;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    console.log({ environment });
    window.addEventListener('message', (e) => this.onMessage(e));
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        window.parent?.postMessage(
          {
            type: 'route-changed',
            route: e.url,
          },
          environment.parentOrigin
        );
      }
    });
    this.resize();
  }

  onMessage(e: MessageEvent) {
    if (e.data === 'resize-request') {
      this.resize();
    }
    if (e.data.type === 'route-changed') {
      this.router.navigate([e.data.route]);
    }
  }

  ngAfterViewChecked(): void {
    this.resize();
  }

  resize() {
    window.parent?.postMessage(
      {
        type: 'resize',
        height: document.documentElement.offsetHeight,
      },
      environment.parentOrigin
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

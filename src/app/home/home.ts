import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private scrollListener?: () => void;
  private observer?: IntersectionObserver;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const host = this.el.nativeElement;
    const sections = host.querySelectorAll<HTMLElement>('section[id]');
    const links = host.querySelectorAll<HTMLElement>('.nav-links a');

    this.scrollListener = () => {
      let current = '';

      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 120) {
          current = section.id;
        }
      });

      links.forEach((link) => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
          link.style.color = 'var(--blue)';
        }
      });
    };

    window.addEventListener('scroll', this.scrollListener);

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    host
      .querySelectorAll<HTMLElement>(
        '.pillar, .service-item, .why-item, .product-card'
      )
      .forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        this.observer?.observe(element);
      });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }

    this.observer?.disconnect();
  }

  onFormSubmit(event: Event): void {
    const button = event.currentTarget as HTMLButtonElement;
    button.textContent = 'Request Sent';
    button.style.background = '#1c8c78';
    button.style.color = '#fff';

    setTimeout(() => {
      button.textContent = 'Send Request';
      button.style.background = '';
      button.style.color = '';
    }, 3000);
  }
}

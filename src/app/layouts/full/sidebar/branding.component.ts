import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <div class="branding">
      <a href="/">
        <img
          src="./assets/images/logos/logo_talan.png"
          class="align-middle m-t-12"
          alt="logo"
          width="120px"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent {
  constructor() {}
}

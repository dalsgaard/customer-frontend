import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";

@customElement("app-root")
export class AppRoot extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    nav {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
  `;

  render() {
    return html`
      <nav>
        <sl-button variant="text" href="/">Home</sl-button>
        <sl-button variant="text" href="/customers">Customers</sl-button>
      </nav>
      <slot></slot>
    `;
  }
}
